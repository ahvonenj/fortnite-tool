var rulegen = null;

(function()
{
	function RuleGenerator()
	{
		this.fn_entities = null;
		this.nouns = null;
		this.adjectives = null;

		this.nMax = 3;
		this.n1Max = 3;
		this.rulesMax = 6;

		this.seededRng = null;

		this.pickedRules = [];

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
		]
	}

	RuleGenerator.prototype.LoadData = function()
	{
		var self = this;

		$.get('../res/fn_entities.json', function(data)
		{
			self.fn_entities = data;
		});

		$.get('../res/adjectives1.txt', function(data)
		{
			self.adjectives = data.split('\n');
		});

		$.get('../res/nouns.txt', function(data)
		{
			self.nouns = data.split('\n');
		});
	}

	RuleGenerator.prototype.GenerateRule = function(picked)
	{
		var handmade = this.seededRng.bool();

		var picked = picked || [];

		if(handmade)
		{
			var pick = this.PickFrom(this.fn_entities.handmade_rules);
			return 
		}
		else
		{
			return this.ParseTemplate(this.PickFrom(this.fn_entities.template_rules));
		}
	}

	RuleGenerator.prototype.GenerateRuleset = function(hash)
	{
		this.pickedRules = [];
		
		if(typeof hash === 'undefined')
		{
			var rule_name_template = this.PickFrom(this.fn_entities.ruleset_naming.templates)[0];
			var rule_name = this.ParseTemplate(rule_name_template);
			var rule_hash = this.Hash(rule_name);

			// Seed further generation with hash
			this.seededRng = new Chance(rule_hash);

			var num_rules = this.seededRng.integer({ min: 1, max:  6});

			var ruleset = [];

			for(var i = 0; i < num_rules; i++)
			{
				ruleset.push(this.GenerateRule());
			}

			console.log(rule_name_template + ' => ' + rule_name + ' (' + rule_hash + ')');
			console.log(rule_name);
			console.log(rule_hash, num_rules);

			console.log(ruleset);
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

	RuleGenerator.prototype.PickFrom = function(set)
	{
		if(this.seededRng)
			var pick = this.seededRng.integer({ min: 0, max: set.length - 1 });
		else
			var pick = chance.integer({ min: 0, max: set.length - 1 });

		return [set[pick], set, pick];
	}

	RuleGenerator.prototype.ParseTemplate = function(template)
	{
		for(var i = 0; i < this.template_substitutions.length; i++)
		{
			var substitution = this.template_substitutions[i];
			var substitution_raw = substitution.replace('{', '').replace('}', '');

			while(template.indexOf(substitution) > -1)
			{
				//console.log('Substituting `' + substitution_raw + '`');

				switch(substitution_raw)
				{
					case "name":
						template = template.replace(substitution, chance.name());
						break;

					case "noun":
						template = template.replace(substitution, this.nouns[this.r(0, this.nouns.length - 1)]);
						break;

					case "adjective":
						template = template.replace(substitution, this.adjectives[this.r(0, this.adjectives.length - 1)]);
						break;

					case "n":
						template = template.replace(substitution, this.r(0, this.nMax));
						break;

					case "n1":
						template = template.replace(substitution, this.r(1, this.n1Max));
						break;

					default:
						template = template.replace(substitution, this.PickFrom(this.fn_entities[substitution_raw])[0]);
						break;
				}
			}
		}

		return template;
	}

	$(document).ready(function()
	{
		rulegen = new RuleGenerator();
		rulegen.LoadData();
	});
})();
