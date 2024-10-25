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
(1, 2, 0.3),  -- ephemeral - serendipity
(1, 3, 0.2),  -- ephemeral - ubiquitous
(2, 4, 0.5),  -- serendipity - eloquent
(3, 5, 0.4),  -- ubiquitous - resilient
(4, 6, 0.6),  -- eloquent - mellifluous
(5, 7, 0.3),  -- resilient - ethereal
(6, 8, 0.4),  -- mellifluous - surreptitious
(7, 9, 0.5),  -- ethereal - perspicacious
(8, 10, 0.2), -- surreptitious - ineffable
(9, 11, 0.3), -- perspicacious - nebulous
(10, 12, 0.4),-- ineffable - labyrinthine
(11, 13, 0.5),-- nebulous - mercurial
(12, 14, 0.6),-- labyrinthine - pellucid
(13, 15, 0.3),-- mercurial - quintessential
(14, 16, 0.4),-- pellucid - recalcitrant
(15, 17, 0.5);-- quintessential - sagacious
