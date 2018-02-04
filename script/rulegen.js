var rulegen = null;

(function()
{
	function RuleGenerator()
	{
		this.$rulecollection = $('#rule-collection');

		this.fn_entities = null;
		this.nouns = null;
		this.adjectives = null;

		this.nMax = 3;
		this.n1Max = 3;
		this.rulesMax = 6;

		this.seededRng = null;

		this.template_substitutions =
		[
			"{name}",
			"{noun}",
			"{adjective}",
			"{doomify}",
			"{gauntlets}",
			"{weapons}",
			"{consumables}",
			"{placeables}",
			"{buildings}",
			"{rarities}",
			"{building_mods}",
			"{places}",
			"{resources}",
			"{n}",
			"{n1}"
		];
	}

	RuleGenerator.prototype.LoadData = function()
	{
		var self = this;

		var def1 = $.get('../res/fn_entities.json', function(data)
		{
			self.fn_entities = data;
		});

		var def2 = $.get('../res/adjectives1.txt', function(data)
		{
			self.adjectives = data.split('\n');
		});

		var def3 = $.get('../res/nouns.txt', function(data)
		{
			self.nouns = data.split('\n');
		});

		$.when(def1, def2, def3).then(function()
		{
			self.GenerateRuleset();
		});
	}

	RuleGenerator.prototype.GenerateRule = function(handmade)
	{
		if(handmade)
		{
			var pick = this.PickFrom(this.fn_entities.handmade_rules);
			return pick;
		}
		else
		{
			var pick = this.PickFrom(this.fn_entities.template_rules);
			pick.rule = this.ParseTemplate(pick.rule, true);
			return pick;
		}
	}

	RuleGenerator.prototype.ValidateRule = function(rule, ruleset)
	{
		if(ruleset.length === 0)
			return true;

		var sameid_rules = ruleset.filter(r => r.rule_id === rule.rule_id)
		var num_sameid_rules = sameid_rules.length;

		if(num_sameid_rules >= rule.limit)
			return false;

		if(ruleset.map(r => r.rule).indexOf(rule.rule) > -1)
			return false;

		if(typeof rule.group === 'undefined')
			return true;

		var samegroup_rules = ruleset.filter(r => r.group === rule.group);
		var num_samegroup_rules = samegroup_rules.length;

		if(num_samegroup_rules >= 1)
			return false;

		return true;
	}

	RuleGenerator.prototype.GenerateRuleset = function(hash)
	{
		var self = this;

		if(typeof hash === 'undefined')
		{
			var rule_name_template = this.PickFrom(this.fn_entities.ruleset_naming.templates, true);
			var rule_name = this.ParseTemplate(rule_name_template, false);
			var rule_hash = this.Hash(rule_name);

			// Seed further generation with hash
			this.seededRng = new Chance(rule_hash);

			var num_rules = this.seededRng.integer({ min: 1, max:  6});

			var ruleset = [];
			var difficulty = 0;

			for(var i = 0; i < num_rules; i++)
			{
				var handmade = this.seededRng.bool();
				var rule = this.GenerateRule(handmade);

				while(this.ValidateRule(rule, ruleset) === false)
				{
					handmade = this.seededRng.bool();
					rule = this.GenerateRule(handmade);
				}

				difficulty += rule.difficulty;
				ruleset.push(rule);
			}

			this.$rulecollection.empty();
			this.$rulecollection.append('<li class="collection-header"><h5>' + rule_name + '</h5></li>'); 
			$('#hashchip').text('Hash: ' + rule_hash);
			$('#difficultychip').text('Difficulty: ' + difficulty + '%');

			ruleset.forEach(function(r)
			{
				self.$rulecollection.append('<li class="collection-item">' + r.rule + '</li>');
			});
		}
		else
		{
			// Seed further generation with hash
			this.seededRng = new Chance(hash);
			var num_rules = this.seededRng.integer({ min: 1, max:  6});

			console.log(hash, num_rules)
		}
	}

	RuleGenerator.prototype.r = function(min, max)
	{
		return chance.integer({ min: min, max: max });
	}

	RuleGenerator.prototype.Hash = function(str)
	{
		var hash = 0, i, chr;

		if (str.length === 0) 
			return hash;

		for (i = 0; i < str.length; i++) 
		{
			chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}

		return hash;
	}

	RuleGenerator.prototype.PickFrom = function(set, forceNoSeed)
	{
		if(this.seededRng !== null && (typeof forceNoSeed === 'undefined'  || forceNoSeed === false))
			var pick = this.seededRng.integer({ min: 0, max: set.length - 1 });
		else
			var pick = chance.integer({ min: 0, max: set.length - 1 });

		// ! FORCE-CLONE TEMPLATE VALUE !
		if(typeof set[pick] === 'object')
			return $.extend(true, {}, set[pick]);
		else if(typeof set[pick] === 'string')
			return (' ' + set[pick]).slice(1);
		else
			return set[pick];
	}

	RuleGenerator.prototype.ParseTemplate = function(template, useSeed)
	{
		var ret = (' ' + template).slice(1);

		for(var i = 0; i < this.template_substitutions.length; i++)
		{
			var substitution = this.template_substitutions[i];
			var substitution_raw = substitution.replace('{', '').replace('}', '');

			while(ret.indexOf(substitution) > -1)
			{
				//console.log('Substituting `' + substitution_raw + '`');

				switch(substitution_raw)
				{
					case "name":
						ret = ret.replace(substitution, chance.name());
						break;

					case "noun":
						ret = ret.replace(substitution, this.nouns[this.r(0, this.nouns.length - 1)]);
						break;

					case "adjective":
						ret = ret.replace(substitution, this.adjectives[this.r(0, this.adjectives.length - 1)]);
						break;

					case "n":
						ret = ret.replace(substitution, this.r(0, this.nMax));
						break;

					case "n1":
						ret = ret.replace(substitution, this.r(1, this.n1Max));
						break;

					default:
						ret = ret.replace(substitution, this.PickFrom(this.fn_entities[substitution_raw], useSeed));
						break;
				}
			}
		}

		return ret;
	}

	$(document).ready(function()
	{
		rulegen = new RuleGenerator();
		rulegen.LoadData();
	});
})();
