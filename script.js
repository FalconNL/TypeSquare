function ViewModel() {
    var self = this;

    self.types = [
        {
            "MBTI": ["I", "S", "F", "P"],
            "Jung": ["Fi", "Se", "Ni", "Te"],
            "Socionics": ["E", "S", "I"],
            "Keirsey": "Composer",
            "Pierce": "Expression"
        },
        {
            "MBTI": ["E", "S", "F", "P"],
            "Jung": ["Se", "Fi", "Te", "Ni"],
            "Socionics": ["S", "E", "E"],
            "Keirsey": "Performer",
            "Pierce": "Energy"
        },
        {
            "MBTI": ["E", "S", "T", "J"],
            "Jung": ["Te", "Si", "Ne", "Fi"],
            "Socionics": ["L", "S", "E"],
            "Keirsey": "Supervisor",
            "Pierce": "Responsibility"
        },
        {
            "MBTI": ["I", "S", "T", "J"],
            "Jung": ["Si", "Te", "Fi", "Ne"],
            "Socionics": ["S", "L", "I"],
            "Keirsey": "Inspector",
            "Pierce": "Solidifying"
        },
        {
            "MBTI": ["I", "N", "F", "P"],
            "Jung": ["Fi", "Ne", "Si", "Te"],
            "Socionics": ["E", "I", "I"],
            "Keirsey": "Healer",
            "Pierce": "Dream-world"
        },
        {
            "MBTI": ["E", "N", "F", "P"],
            "Jung": ["Ne", "Fi", "Te", "Si"],
            "Socionics": ["I", "E", "E"],
            "Keirsey": "Champion",
            "Pierce": "Child-like"
        },
        {
            "MBTI": ["E", "N", "T", "J"],
            "Jung": ["Te", "Ni", "Se", "Fi"],
            "Socionics": ["L", "I", "E"],
            "Keirsey": "Fieldmarshal",
            "Pierce": "Subjugation"
        },
        {
            "MBTI": ["I", "N", "T", "J"],
            "Jung": ["Ni", "Te", "Fi", "Se"],
            "Socionics": ["I", "L", "I"],
            "Keirsey": "Mastermind",
            "Pierce": "Visionary"
        },
        {
            "MBTI": ["E", "S", "T", "P"],
            "Jung": ["Se", "Ti", "Fe", "Ni"],
            "Socionics": ["S", "L", "E"],
            "Keirsey": "Promotor",
            "Pierce": "Conquering"
        },
        {
            "MBTI": ["I", "S", "T", "P"],
            "Jung": ["Ti", "Se", "Ni", "Fe"],
            "Socionics": ["L", "S", "I"],
            "Keirsey": "Crafter",
            "Pierce": "Mastering"
        },
        {
            "MBTI": ["I", "S", "F", "J"],
            "Jung": ["Si", "Fe", "Ti", "Ne"],
            "Socionics": ["S", "E", "I"],
            "Keirsey": "Protector",
            "Pierce": "Dedication"
        },
        {
            "MBTI": ["E", "S", "F", "J"],
            "Jung": ["Fe", "Si", "Ne", "Ti"],
            "Socionics": ["E", "S", "E"],
            "Keirsey": "Provider",
            "Pierce": "Cooperation"
        },
        {
            "MBTI": ["I", "N", "T", "P"],
            "Jung": ["Ti", "Ne", "Si", "Fe"],
            "Socionics": ["L", "I", "I"],
            "Keirsey": "Architect",
            "Pierce": "Abstracting"
        },
        {
            "MBTI": ["E", "N", "T", "P"],
            "Jung": ["Ne", "Ti", "Fe", "Si"],
            "Socionics": ["I", "L", "E"],
            "Keirsey": "Inventor",
            "Pierce": "Multifaceted"
        },
        {
            "MBTI": ["E", "N", "F", "J"],
            "Jung": ["Fe", "Ni", "Se", "Ti"],
            "Socionics": ["E", "I", "E"],
            "Keirsey": "Teacher",
            "Pierce": "Persuasion"
        },
        {
            "MBTI": ["I", "N", "F", "J"],
            "Jung": ["Ni", "Fe", "Ti", "Se"],
            "Socionics": ["I", "E", "I"],
            "Keirsey": "Counselor",
            "Pierce": "Idealistic"
        },
    ];

    self.activeType = ko.observable();

    self.columns = {
        main: { left: "Sensors", right: "Intuitives", condition: function(type) { return _.contains(type.MBTI, "S"); } },
        sub1: { left: "P-Dom",   right: "J-Dom",      condition: function(type) { return _.contains("NS", type.Jung[0][0]); } },
        sub2: { left: "J-Dom",   right: "P-Dom",      condition: function(type) { return _.contains("FT", type.Jung[0][0]); } }
    };

    self.rows = {
        main: { left: "Fe-Ti", right: "Fi-Te", condition: function(type) { return _.contains(type.Jung, "Fe"); } },
        sub1: { left: "Ne-Si Alpha", right: "Ni-Se Beta",  condition: function(type) { return _.contains(type.Jung, "Si"); } },
        sub2: { left: "Ni-Se Gamma", right: "Ne-Si Delta", condition: function(type) { return _.contains(type.Jung, "Ni"); } }
    };

    self.find = function(mainCol, subCol, mainRow, subRow) {
        return _.find(self.types, function(type) {
            return self.columns.main.condition(type) == mainCol &&
                   (mainCol ? self.columns.sub1 : self.columns.sub2).condition(type) == subCol &&
                   self.rows.main.condition(type) == mainRow &&
                   (mainRow ? self.rows.sub1 : self.rows.sub2).condition(type) == subRow;
        });
    };

    self.toSocionics = function(mbti) {
        var socionics = mbti.slice(0, 3).join('');
        if (mbti[0] == "I") {
            return socionics + (mbti[3] == "J" ? "p" : "j");
        }
        else {
            return socionics + (mbti[3] == "J" ? "j" : "p");
        }
    }

    self.relation = function(type) {
        if (!self.activeType()) {
            return "&nbsp;";
        }

        return self.relationBetween(self.activeType(), type);
    }

    self.relationBetween = function(type1, type2) {
        var rel = self.jungRelation(type1, type2);
        
        var relationship = _.isEqual(rel, [ 1,  2]) ? { name: "Identity",       desc: function(from, to) { return "A relationship characterized by mutual understanding, self-development, and learning. Each is interested in the other's ideas, and sees their value."; } } :
                           _.isEqual(rel, [ 2,  1]) ? { name: "Mirror",         desc: function(from, to) { return "A relationship characterized by similar actions and motivations between partners, and mutual understanding."; } } :
                           _.isEqual(rel, [ 3,  4]) ? { name: "Activation",     desc: function(from, to) { return "A relationship characterized by easy communication but different world views and goals. A common relationship for friendship."; } } :
                           _.isEqual(rel, [ 4,  3]) ? { name: "Duality",        desc: function(from, to) { return "A relationship characterized by mutual benefit and support, viewed as optimal for friendship, intimacy, and marriage."; } } :

                           _.isEqual(rel, [-1, -2]) ? { name: "Contrary",       desc: function(from, to) { return "A relationship characterized by similar lifestyles but differing thought processes that works well one-on-one, but is easily unbalanced when not alone."; } } :
                           _.isEqual(rel, [-2, -1]) ? { name: "Quasi-identity", desc: function(from, to) { return "A relationship characterized by mutual misunderstanding. They have similar interests, but will rarely understand each other's motivations or ideas."; } } :
                           _.isEqual(rel, [-3, -4]) ? { name: "Conflict",       desc: function(from, to) { return "A relationship characterized by constantly escalating conflict. They rarely understand anything regarding each other's motivations or lifestyles."; } } :
                           _.isEqual(rel, [-4, -3]) ? { name: "Super-ego",      desc: function(from, to) { return "A relationship characterized by differing values, discomfort, and mutual misunderstanding."; } } :
                           
                           _.isEqual(rel, [-1,  3]) ? { name: "Mirage",         desc: function(from, to) { return "A relationship characterized by easy initial attraction that often becomes quite close."; } } :
                           _.isEqual(rel, [ 1, -3]) ? { name: "Kindred",        desc: function(from, to) { return "A relationship characterized by a high degree of similarity, though in the long term this may lead to competition or boredom."; } } :
                           _.isEqual(rel, [-4,  2]) ? { name: "Business",       desc: function(from, to) { return "A relationship characterized by a formal and business-like conduct to avoid conflict caused by differing internal motivations."; } } :
                           _.isEqual(rel, [ 4, -2]) ? { name: "Semi-duality",   desc: function(from, to) { return "A relationship characterized by mutual interest but also misunderstanding, leading to cycles of establishing and losing harmony."; } } :

                           _.isEqual(rel, [-3,  1]) ? { name: "Supervisee",     desc: function(from, to) { return "A relationship characterized by the " + to + " feeling controlled and criticized by the " + from + ", who is often dissatisfied with the actions of the " + to + "."; } } :
                           _.isEqual(rel, [ 3, -1]) ? { name: "Benefactor",     desc: function(from, to) { return "A relationship characterized by the " + from + " looking up to and trying to prove themself to the " + to + ", who does not find the " + from + " a very interesting person."; } } :
                           _.isEqual(rel, [ 2, -4]) ? { name: "Supervisor",     desc: function(from, to) { return "A relationship characterized by the " + from + " feeling controlled and criticized by the " + to + ", who is often dissatisfied with the actions of the " + from + "."; } } :
                                                      { name: "Beneficiary",    desc: function(from, to) { return "A relationship characterized by the " + to + " looking up to and trying to prove themself to the " + from + ", who does not find the " + to + " a very interesting person."; } };

        return { name: relationship.name, desc: relationship.desc(type1.MBTI.join(''), type2.MBTI.join('')) };
    };

    self.jungRelation = function(type1, type2) {
        return _.map([0,1], function(i) {
            var j = _.findIndex(type2.Jung, function(f2) { return f2[0] == type1.Jung[i][0]; });
            return (j + 1) * (type2.Jung[j][1] == type1.Jung[i][1] ? 1 : -1);
        });
    }
}

ko.applyBindings(new ViewModel());