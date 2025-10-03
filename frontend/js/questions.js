// ====================================================================================
//                                  QUESTIONS DATA
// ====================================================================================

const QUESTION_DATA = {
    'general-culture': [
        // Interrogative Words Questions
        { 
            q: '____ is the capital of France?', 
            opts: ['What', 'Where', 'Which', 'Who'], 
            a: 0, 
            diff: 'easy', 
            img: '../images/paris.jpeg',
            category: 'general-culture'
        },
        { 
            q: '____ many continents are there in the world?', 
            opts: ['What', 'How', 'Where', 'When'], 
            a: 1, 
            diff: 'easy', 
            img: '../images/continents.jpg',
            category: 'general-culture'
        },
        { 
            q: '____ did the Second World War end?', 
            opts: ['How', 'What', 'When', 'Who'], 
            a: 2, 
            diff: 'easy', 
            img: '../images/segunda_guerra.jpg',
            category: 'general-culture'
        },
        { 
            q: '____ is the primary reason for the greenhouse effect?', 
            opts: ['Who', 'Where', 'Why', 'How'], 
            a: 2, 
            diff: 'medium', 
            img: '../images/efecto-invernadero.jpg',
            category: 'general-culture'
        },
        { 
            q: '____ invented the telephone?', 
            opts: ['What', 'Who', 'When', 'Where'], 
            a: 1, 
            diff: 'medium', 
            img: '../images/inventor-telefono.jfif',
            category: 'general-culture'
        },
        { 
            q: '____ is Mount Everest located?', 
            opts: ['What', 'Where', 'How', 'Why'], 
            a: 1, 
            diff: 'medium', 
            img: '../images/everest.jpeg',
            category: 'general-culture'
        },
        { 
            q: '____ country is known as the Land of the Rising Sun?', 
            opts: ['What', 'Which', 'Who', 'How'], 
            a: 1, 
            diff: 'medium', 
            img: '../images/japon.jpg',
            category: 'general-culture'
        },
        { 
            q: '____ is photosynthesis explained simply?', 
            opts: ['Where', 'What', 'How', 'Why'], 
            a: 2, 
            diff: 'hard', 
            img: '../images/fotosintesis.jpg',
            category: 'general-culture'
        },
        { 
            q: '____ is the population density of Monaco so high?', 
            opts: ['Where', 'How', 'Why', 'What'], 
            a: 2, 
            diff: 'hard', 
            img: '../images/monaco.jpg',
            category: 'general-culture'
        },
        
        // Negative Words/Grammar Questions
        { 
            q: 'Choose the correct negative form: "I have ____ money."', 
            opts: ['no', 'not', 'none', 'neither'], 
            a: 0, 
            diff: 'easy', 
            img: '../images/no-hay-plata.jfif',
            category: 'general-culture'
        },
        { 
            q: 'Select the correct usage: "he did ____ go to the party."', 
            opts: ['not', 'no', 'never', 'none'], 
            a: 0, 
            diff: 'easy', 
            img: '../images/fiesta.jpg',
            category: 'general-culture'
        },
        { 
            q: 'Which word is a negative adverb?', 
            opts: ['Never', 'Always', 'Often', 'Sometimes'], 
            a: 0, 
            diff: 'easy', 
            img: '../images/negar.jpg',
            category: 'general-culture'
        },
        { 
            q: 'Complete the sentence: "There is ____ sugar left."', 
            opts: ['no', 'any', 'some', 'much'], 
            a: 0, 
            diff: 'easy', 
            img: '../images/azucar.jpg',
            category: 'general-culture'
        },
        { 
            q: 'Choose the sentence with the double negative error:', 
            opts: ['I don\'t have any money', 'He has no car', 'She never helps me', 'I didn\'t see nobody'], 
            a: 3, 
            diff: 'medium', 
            img: '../images/negacion2.png',
            category: 'general-culture'
        },
        { 
            q: 'Select the sentence with the correct word order:', 
            opts: ['He speaks English not', 'Not he speaks English', 'He does not speak English', 'English speaks not he'], 
            a: 2, 
            diff: 'medium', 
            img: '../images/eu.png',
            category: 'general-culture'
        },
        { 
            q: 'Which of these words means "almost never"?', 
            opts: ['Seldom', 'Always', 'Frequently', 'Usually'], 
            a: 0, 
            diff: 'medium', 
            img: '../images/nunca.jpg',
            category: 'general-culture'
        },
        { 
            q: 'Choose the correct structure: "____ of the answers were correct."', 
            opts: ['Neither', 'All', 'Some', 'Most'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?test,answers',
            category: 'general-culture'
        },
        { 
            q: 'What does the word "scarcely" imply?', 
            opts: ['Barely/Almost not', 'Frequently', 'Always', 'Completely'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?barely,little',
            category: 'general-culture'
        },
        { 
            q: 'Complete the sentence with inversion: "____ until dark did we leave."', 
            opts: ['Not', 'Only', 'Hardly', 'Never'], 
            a: 1, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?dark,inversion',
            category: 'general-culture'
        },
    ],
    'english-grammar': [
        // Basic Grammar Questions
        { 
            q: 'Choose the correct tense: "She ____ to the market yesterday."', 
            opts: ['went', 'go', 'goes', 'going'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?english,lesson',
            category: 'english-grammar'
        },
        { 
            q: 'Complete: "____ is your name?"', 
            opts: ['What', 'Who', 'When', 'Where'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?question,mark',
            category: 'english-grammar'
        },
        { 
            q: 'What is the correct plural of "foot"?', 
            opts: ['feet', 'foots', 'footies', 'feets'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?feet,shoes',
            category: 'english-grammar'
        },
        { 
            q: 'Choose the correct preposition: "The book is ____ the table."', 
            opts: ['on', 'at', 'in', 'to'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?table,book',
            category: 'english-grammar'
        },
        { 
            q: 'Perfect tense: "They ____ finished their homework yet."', 
            opts: ['haven\'t', 'hasn\'t', 'don\'t', 'didn\'t'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?homework,desk',
            category: 'english-grammar'
        },
        { 
            q: 'What is the use of "could" in a question?', 
            opts: ['To ask for permission or make a suggestion', 'To express obligation', 'To talk about future plans', 'To express certainty'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?permission,suggestion',
            category: 'english-grammar'
        },
        { 
            q: 'Choose the correct conditional: "If I had known, I ____ helped."', 
            opts: ['would have', 'would', 'will have', 'had'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?help,knowledge',
            category: 'english-grammar'
        },
        { 
            q: 'What type of word is "Although"?', 
            opts: ['Subordinating Conjunction', 'Adverb', 'Preposition', 'Interjection'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?connecting,words',
            category: 'english-grammar'
        },
        { 
            q: 'What is the meaning of "phrasal verb"?', 
            opts: ['Verb + preposition/adverb that changes the meaning', 'Verbs conjugated in the past tense', 'Auxiliary verbs', 'Irregular verbs'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?combination,language',
            category: 'english-grammar'
        },
        { 
            q: 'Choose the passive voice: "The report ____ by the manager."', 
            opts: ['was written', 'wrote', 'has write', 'is writing'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?report,manager',
            category: 'english-grammar'
        },

        // Additional Grammar Questions
        { 
            q: 'Complete the sentence: "I would like to buy ____ new shoes."', 
            opts: ['a', 'an', 'some', 'any'], 
            a: 2, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?shoes,buy',
            category: 'english-grammar'
        },
        { 
            q: 'Which sentence uses the present continuous correctly?', 
            opts: ['She is reading a book now', 'She read a book yesterday', 'She reads a book every day', 'She will read a book later'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?reading,girl',
            category: 'english-grammar'
        },
        { 
            q: 'Choose the correct possessive adjective: "This is my book, where is ____?"', 
            opts: ['your', 'you', 'yours', 'mine'], 
            a: 2, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?personal,belongings',
            category: 'english-grammar'
        },
        { 
            q: 'Which word is the adverb in the sentence: "The man drove quickly down the street."', 
            opts: ['The', 'man', 'drove', 'quickly'], 
            a: 3, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?car,speed',
            category: 'english-grammar'
        },
        { 
            q: 'Choose the correct sentence using the second conditional.', 
            opts: ['If I had money, I would buy a house', 'If I have money, I will buy a house', 'If I money, I buy a house', 'If I had money, I will buy a house'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?dream,house',
            category: 'english-grammar'
        },
        { 
            q: 'Complete the sentence: "She stopped ____ when she saw the sign."', 
            opts: ['to smoke', 'smoking', 'smoke', 'smoked'], 
            a: 1, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?stop,sign',
            category: 'english-grammar'
        },
        { 
            q: 'What is the correct use of a modal verb for strong necessity?', 
            opts: ['You must wear a helmet', 'You can wear a helmet', 'You should wear a helmet', 'You might wear a helmet'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?safety,helmet',
            category: 'english-grammar'
        },
        { 
            q: 'Choose the correct relative clause: "The city ____ I grew up is noisy."', 
            opts: ['who', 'whose', 'which', 'where'], 
            a: 3, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?city,buildings',
            category: 'english-grammar'
        },
        { 
            q: 'Complete with the correct phrasal verb: "I need to turn ____ the volume, it\'s too loud."', 
            opts: ['up', 'off', 'down', 'out'], 
            a: 2, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?volume,music',
            category: 'english-grammar'
        },
        { 
            q: 'Identify the word that causes the double comparison error: "He is more taller than his brother."', 
            opts: ['He is', 'more taller', 'than', 'his brother'], 
            a: 1, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?error,correction',
            category: 'english-grammar'
        },
    ],
    'colombian-culture': [
        // Basic Colombian Culture
        { 
            q: 'What is the capital of Colombia?', 
            opts: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?bogota,colombia',
            category: 'colombian-culture'
        },
        { 
            q: 'What is Colombia\'s main export product?', 
            opts: ['Coffee', 'Flowers', 'Oil', 'Banana'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?colombian,coffee',
            category: 'colombian-culture'
        },
        { 
            q: 'What is the national tree of Colombia?', 
            opts: ['Wax Palm', 'Ceiba', 'Oak', 'Rubber'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?wax,palm',
            category: 'colombian-culture'
        },
        { 
            q: 'What is the name of the sea that bathes the Colombian Caribbean coasts?', 
            opts: ['Caribbean Sea', 'Pacific Ocean', 'Sea of Cortés', 'Atlantic Ocean'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?caribbean,sea,colombia',
            category: 'colombian-culture'
        },
        { 
            q: 'Which region of Colombia is known for the Vallenato Legend Festival?', 
            opts: ['Caribbean Region (Valledupar)', 'Andean Region', 'Pacific Region', 'Orinoquía'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?vallenato,festival',
            category: 'colombian-culture'
        },
        { 
            q: 'Who was the leader of the Colombian independence movement?', 
            opts: ['Simón Bolívar', 'Antonio Nariño', 'Francisco de Paula Santander', 'Camilo Torres'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?simon,bolivar,statue',
            category: 'colombian-culture'
        },
        { 
            q: 'Which of these is NOT a department of the Colombian Amazon Region?', 
            opts: ['Vaupés', 'Guainía', 'Putumayo', 'Casanare'], 
            a: 3, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?amazon,river,jungle',
            category: 'colombian-culture'
        },
        { 
            q: 'In which year was the current peace agreement between the government and the FARC signed?', 
            opts: ['2016', '2010', '2018', '2002'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?peace,handshake',
            category: 'colombian-culture'
        },
        { 
            q: 'What is the highest point in Colombia?', 
            opts: ['Pico Cristóbal Colón', 'Nevado del Huila', 'Sierra Nevada de Santa Marta', 'Pico Simón Bolívar'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?sierra,nevada,mountain',
            category: 'colombian-culture'
        },
        { 
            q: 'In which year was the city of Cartagena de Indias founded?', 
            opts: ['1533', '1499', '1510', '1560'], 
            a: 0, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?cartagena,wall',
            category: 'colombian-culture'
        },
        
        // Additional Colombian Culture Questions
        { 
            q: 'What is the region where the dish Ajiaco is most typical?', 
            opts: ['Caribbean', 'Pacific', 'Andean (Cundiboyacense Plateau)', 'Orinoquía'], 
            a: 2, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?ajiaco,soup',
            category: 'colombian-culture'
        },
        { 
            q: 'Which famous Colombian artist is known for his large-volume sculptures and paintings?', 
            opts: ['Fernando Botero', 'Alejandro Obregón', 'Doris Salcedo', 'Omar Rayo'], 
            a: 0, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?botero,sculpture',
            category: 'colombian-culture'
        },
        { 
            q: 'Which Colombian city is known as the "Salsa Capital of the World"?', 
            opts: ['Medellín', 'Barranquilla', 'Cali', 'Cartagena'], 
            a: 2, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?cali,salsa',
            category: 'colombian-culture'
        },
        { 
            q: 'What is the name of the most important river that crosses Colombia from south to north?', 
            opts: ['Río Cauca', 'Río Atrato', 'Río Magdalena', 'Río Amazonas'], 
            a: 2, 
            diff: 'easy', 
            img: 'https://source.unsplash.com/800x450/?magdalena,river',
            category: 'colombian-culture'
        },
        { 
            q: 'What is the name of the traditional Christmas candle lighting celebration held in December?', 
            opts: ['Noche de Velitas (Día de las Velitas)', 'La Alborada', 'Carnaval de Negros y Blancos', 'Feria de Cali'], 
            a: 0, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?candles,velitas',
            category: 'colombian-culture'
        },
        { 
            q: 'What is the Colombian term for the agricultural region where coffee is mainly grown?', 
            opts: ['Páramo', 'Llano', 'Eje Cafetero', 'Amazonía'], 
            a: 2, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?coffee,plantations',
            category: 'colombian-culture'
        },
        { 
            q: 'What is the traditional Colombian sweet made of milk and sugar, similar to dulce de leche?', 
            opts: ['Bocadillo', 'Arequipe', 'Manjar Blanco', 'Melao'], 
            a: 1, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?dulce,milk',
            category: 'colombian-culture'
        },
        { 
            q: 'Which UNESCO Intangible Cultural Heritage event is celebrated mainly in Pasto?', 
            opts: ['Carnaval de Barranquilla', 'Feria de Manizales', 'Carnaval de Negros y Blancos', 'Festival Iberoamericano de Teatro'], 
            a: 2, 
            diff: 'medium', 
            img: 'https://source.unsplash.com/800x450/?pasto,festival',
            category: 'colombian-culture'
        },
        { 
            q: 'The Treaty of Tordesillas established a division of the new world between which two European powers, which influenced Colombia\'s history?', 
            opts: ['Spain and France', 'Spain and Portugal', 'Portugal and England', 'Spain and England'], 
            a: 1, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?old,map,treaty',
            category: 'colombian-culture'
        },
        { 
            q: 'Which pre-Columbian culture is known for its intricate goldwork and the legend of El Dorado?', 
            opts: ['San Agustín', 'Tayrona', 'Quimbaya', 'Muisca'], 
            a: 3, 
            diff: 'hard', 
            img: 'https://source.unsplash.com/800x450/?gold,museum',
            category: 'colombian-culture'
        },
    ],
};

// Función para obtener preguntas por categoría
function getQuestionsByCategory(category) {
    return QUESTION_DATA[category] || [];
}

// Función para obtener todas las preguntas (para modo mixto)
function getAllQuestions() {
    const allQuestions = [];
    for (const category in QUESTION_DATA) {
        allQuestions.push(...QUESTION_DATA[category]);
    }
    return allQuestions;
}

// Hacer las preguntas disponibles globalmente
window.questions = getAllQuestions();
window.QUESTION_DATA = QUESTION_DATA;