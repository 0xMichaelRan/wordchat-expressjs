-- Insert sample words
INSERT INTO words (word, definition, details) VALUES
('ephemeral', 'Lasting for a very short time', 'From Greek "ephemeros" meaning lasting only one day'),
('serendipity', 'The occurrence of finding pleasant things by chance', 'Coined by Horace Walpole in 1754'),
('ubiquitous', 'Present, appearing, or found everywhere', 'From Latin "ubique" meaning everywhere'),
('eloquent', 'Fluent or persuasive in speaking or writing', 'From Latin "eloqui" meaning to speak out'),
('resilient', 'Able to recover quickly from difficulties', 'From Latin "resilire" meaning to spring back'),
('mellifluous', 'Sweet or musical; pleasant to hear', 'From Latin "mel" (honey) and "fluere" (to flow)'),
('ethereal', 'Extremely delicate and light', 'From Greek "aither" meaning pure, fresh air'),
('surreptitious', 'Kept secret, especially because improper', 'From Latin "surripere" meaning to snatch secretly'),
('perspicacious', 'Having a ready insight into things', 'From Latin "perspicax" meaning sharp-sighted'),
('ineffable', 'Too great or extreme to be expressed in words', 'From Latin "ineffabilis" meaning unutterable'),
('nebulous', 'Unclear, vague, or ill-defined', 'From Latin "nebula" meaning mist or cloud'),
('labyrinthine', 'Complicated and confusing', 'From Greek "labyrinthos" meaning maze'),
('mercurial', 'Subject to sudden or unpredictable changes of mood', 'From the Roman god Mercury'),
('pellucid', 'Translucently clear', 'From Latin "pellucidus" meaning transparent'),
('quintessential', 'Representing the most perfect example', 'From Latin "quinta essentia" meaning fifth essence'),
('recalcitrant', 'Having an obstinately uncooperative attitude', 'From Latin "recalcitrare" meaning to kick back'),
('sagacious', 'Having good judgment and keen mental discernment', 'From Latin "sagax" meaning wise'),
('taciturn', 'Reserved or uncommunicative in speech', 'From Latin "tacitus" meaning silent'),
('verdant', 'Green with grass or rich in vegetation', 'From Latin "viridis" meaning green'),
('whimsical', 'Playfully quaint or fanciful', 'From "whimsy", perhaps from "whim-wham"'),
('xenial', 'Of, relating to, or constituting hospitality', 'From Greek "xenos" meaning guest or stranger'),
('yearning', 'Having an intense feeling of longing', 'From Old English "geornan"'),
('zealous', 'Having great energy or enthusiasm', 'From Latin "zelosus"'),
('aberration', 'A departure from what is normal', 'From Latin "aberrare" meaning to wander away'),
('bucolic', 'Of or relating to the pleasant aspects of country life', 'From Greek "boukolos" meaning cowherd'),
('cacophony', 'A harsh mixture of sounds', 'From Greek "kakos" meaning bad and "phone" meaning sound'),
('defenestration', 'The act of throwing someone out of a window', 'From Latin "de-" and "fenestra" meaning window'),
('effervescent', 'Vivacious and enthusiastic', 'From Latin "effervescere" meaning to boil up'),
('fastidious', 'Very attentive to detail', 'From Latin "fastidium" meaning loathing'),
('garrulous', 'Excessively talkative', 'From Latin "garrulus" meaning chattering'),
('halcyon', 'Denoting a period of time that was idyllically happy', 'From Greek "alkyon" meaning kingfisher'),
('idiosyncratic', 'Peculiar or individual', 'From Greek "idios" meaning own and "synkratikos" meaning mixed'),
('juxtaposition', 'The fact of two things being placed close together', 'From Latin "juxta" meaning next'),
('kaleidoscopic', 'Having complex patterns of colors', 'From Greek "kalos" meaning beautiful'),
('loquacious', 'Tending to talk a great deal', 'From Latin "loqui" meaning to speak'),
('maelstrom', 'A powerful whirlpool in the sea', 'From Dutch "maelstrom" meaning grinding stream'),
('nefarious', 'Wicked or criminal', 'From Latin "nefarius" meaning impious'),
('obfuscate', 'Make obscure or unclear', 'From Latin "ob" meaning over and "fuscare" meaning to darken'),
('panacea', 'A solution for all problems', 'From Greek "panakeia" meaning all-healing'),
('quixotic', 'Exceedingly idealistic', 'From Don Quixote, the novel by Cervantes'),
('redolent', 'Strongly reminiscent or suggestive of', 'From Latin "redolere" meaning to emit a scent'),
('solipsistic', 'Self-centered and selfish', 'From Latin "solus" meaning alone and "ipse" meaning self'),
('trepidation', 'A feeling of fear or anxiety', 'From Latin "trepidare" meaning to tremble'),
('umbrage', 'Offense or annoyance', 'From Latin "umbra" meaning shadow'),
('vacillate', 'Waver between different opinions', 'From Latin "vacillare" meaning to sway'),
('wanderlust', 'A strong desire to travel', 'From German "wandern" meaning to hike'),
('xerotic', 'Characterized by dryness', 'From Greek "xeros" meaning dry'),
('yoke', 'A wooden crosspiece for harnessing animals', 'From Old English "geoc"'),
('zephyr', 'A gentle, mild breeze', 'From Greek "zephyros" meaning the west wind');

-- Add more history entries for words with id 1, 2, and 3
INSERT INTO definition_history (word_id, previous_definition) VALUES
(1, 'A short-lived or transient thing'),
(1, 'Existing only briefly'),
(1, 'Fleeting or transitory'),
(2, 'The faculty of making fortunate discoveries by accident'),
(2, 'The occurrence and development of events by chance in a happy or beneficial way'),
(2, 'A fortunate happenstance'),
(3, 'Existing or being everywhere at the same time'),
(3, 'Constantly encountered'),
(3, 'Widespread');

-- Add some random relations to the related_words table
INSERT INTO related_words (word_id, related_word_id, correlation) VALUES
(1, 2, 0.3), (2, 1, 0.3),  -- ephemeral - serendipity
(1, 3, 0.2), (3, 1, 0.2),  -- ephemeral - ubiquitous
(2, 4, 0.5), (4, 2, 0.5),  -- serendipity - eloquent
(3, 5, 0.4), (5, 3, 0.4),  -- ubiquitous - resilient
(4, 6, 0.6), (6, 4, 0.6),  -- eloquent - mellifluous
(5, 7, 0.3), (7, 5, 0.3),  -- resilient - ethereal
(6, 8, 0.4), (8, 6, 0.4),  -- mellifluous - surreptitious
(7, 9, 0.5), (9, 7, 0.5),  -- ethereal - perspicacious
(8, 10, 0.2), (10, 8, 0.2), -- surreptitious - ineffable
(9, 11, 0.3), (11, 9, 0.3), -- perspicacious - nebulous
(10, 12, 0.4), (12, 10, 0.4),-- ineffable - labyrinthine
(11, 13, 0.5), (13, 11, 0.5),-- nebulous - mercurial
(12, 14, 0.6), (14, 12, 0.6),-- labyrinthine - pellucid
(13, 15, 0.3), (15, 13, 0.3),-- mercurial - quintessential
(14, 16, 0.4), (16, 14, 0.4),-- pellucid - recalcitrant
(15, 17, 0.5), (17, 15, 0.5),-- quintessential - sagacious
(1, 18, 0.4), (18, 1, 0.4),  -- ephemeral - taciturn
(2, 19, 0.3), (19, 2, 0.3),  -- serendipity - verdant
(3, 20, 0.5), (20, 3, 0.5),  -- ubiquitous - whimsical
(4, 21, 0.2), (21, 4, 0.2),  -- eloquent - xenial
(5, 22, 0.4), (22, 5, 0.4),  -- resilient - yearning
(6, 23, 0.3), (23, 6, 0.3),  -- mellifluous - zealous
(7, 24, 0.5), (24, 7, 0.5),  -- ethereal - aberration
(8, 25, 0.4), (25, 8, 0.4),  -- surreptitious - bucolic
(9, 26, 0.3), (26, 9, 0.3),  -- perspicacious - cacophony
(10, 27, 0.2), (27, 10, 0.2),-- ineffable - defenestration
(11, 28, 0.4), (28, 11, 0.4),-- nebulous - effervescent
(12, 29, 0.5), (29, 12, 0.5),-- labyrinthine - fastidious
(13, 30, 0.3), (30, 13, 0.3),-- mercurial - garrulous
(14, 31, 0.4), (31, 14, 0.4),-- pellucid - halcyon
(15, 32, 0.5), (32, 15, 0.5),-- quintessential - idiosyncratic
(16, 33, 0.3), (33, 16, 0.3),-- recalcitrant - juxtaposition
(17, 34, 0.4), (34, 17, 0.4),-- sagacious - kaleidoscopic
(18, 35, 0.5), (35, 18, 0.5),-- taciturn - loquacious
(19, 36, 0.3), (36, 19, 0.3),-- verdant - maelstrom
(20, 37, 0.4), (37, 20, 0.4),-- whimsical - nefarious
(21, 38, 0.2), (38, 21, 0.2),-- xenial - obfuscate
(22, 39, 0.5), (39, 22, 0.5),-- yearning - panacea
(23, 40, 0.3), (40, 23, 0.3),-- zealous - quixotic
(24, 41, 0.4), (41, 24, 0.4),-- aberration - redolent
(25, 42, 0.5), (42, 25, 0.5),-- bucolic - solipsistic
(26, 43, 0.3), (43, 26, 0.3),-- cacophony - trepidation
(27, 44, 0.4), (44, 27, 0.4),-- defenestration - umbrage
(28, 45, 0.5), (45, 28, 0.5),-- effervescent - vacillate
(29, 46, 0.3), (46, 29, 0.3),-- fastidious - wanderlust
(30, 47, 0.4), (47, 30, 0.4),-- garrulous - xerotic
(31, 48, 0.2), (48, 31, 0.2),-- halcyon - yoke
(32, 49, 0.5), (49, 32, 0.5) -- idiosyncratic - zephyr
(1, 4, 0.3), (4, 1, 0.3),  -- ephemeral - eloquent
(1, 5, 0.2), (5, 1, 0.2),  -- ephemeral - resilient
(1, 6, 0.5), (6, 1, 0.5),  -- ephemeral - mellifluous
(1, 7, 0.6), (7, 1, 0.6),  -- ephemeral - ethereal (strong correlation)
(1, 8, 0.3), (8, 1, 0.3),  -- ephemeral - surreptitious
(1, 9, 0.4), (9, 1, 0.4),  -- ephemeral - perspicacious
(2, 3, 0.4), (3, 2, 0.4),  -- serendipity - ubiquitous
(2, 5, 0.3), (5, 2, 0.3),  -- serendipity - resilient
(2, 6, 0.2), (6, 2, 0.2),  -- serendipity - mellifluous
(2, 7, 0.5), (7, 2, 0.5),  -- serendipity - ethereal
(2, 8, 0.3), (8, 2, 0.3),  -- serendipity - surreptitious
(2, 9, 0.4), (9, 2, 0.4)   -- serendipity - perspicacious


