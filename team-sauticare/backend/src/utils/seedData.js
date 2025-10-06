const Resource = require("../models/Resource");
const logger = require("./logger");

const seedResources = async () => {
    try {
        // Check if resources already exist
        const existingResources = await Resource.countDocuments();
        if (existingResources > 0) {
            logger.info("Resources already seeded, skipping...");
            return;
        }

        const resources = [
            // Crisis Resources
            {
                title: "Crisis Hotline - Nigeria",
                description: "24/7 mental health crisis support hotline",
                content:
                    "Call +234-806-210-0053 for immediate mental health crisis support. Available 24/7.",
                type: "hotline",
                category: "crisis",
                languages: ["en", "pidgin", "hausa"],
                translations: {
                    en: {
                        title: "Crisis Hotline - Nigeria",
                        description:
                            "24/7 mental health crisis support hotline",
                        content:
                            "Call +234-806-210-0053 for immediate mental health crisis support. Available 24/7.",
                    },
                    pidgin: {
                        title: "Crisis Hotline - Nigeria",
                        description: "24/7 mental health support hotline",
                        content:
                            "Call +234-806-210-0053 for immediate mental health support. E dey available 24/7.",
                    },
                    hausa: {
                        title: "Lambar Gaggawa - Nigeria",
                        description: "Tallafin lafiyar hankali na 24/7",
                        content:
                            "Kira +234-806-210-0053 don tallafin lafiyar hankali na gaggawa. Yana aiki 24/7.",
                    },
                },
                crisisRelevant: true,
                emergencyContact: {
                    name: "Nigeria Mental Health Crisis Line",
                    phone: "+234-806-210-0053",
                    available: "24/7",
                },
                metadata: {
                    tags: ["crisis", "emergency", "hotline", "24/7"],
                    author: "SautiCare",
                    source: "Official Crisis Support",
                },
            },
            {
                title: "Emergency Services",
                description: "Emergency services contact information",
                content:
                    "For immediate life-threatening emergencies, call 199 or 112.",
                type: "emergency",
                category: "crisis",
                languages: ["en", "pidgin", "hausa"],
                translations: {
                    en: {
                        title: "Emergency Services",
                        description: "Emergency services contact information",
                        content:
                            "For immediate life-threatening emergencies, call 199 or 112.",
                    },
                    pidgin: {
                        title: "Emergency Services",
                        description: "Emergency services contact information",
                        content:
                            "For immediate life-threatening emergencies, call 199 or 112.",
                    },
                    hausa: {
                        title: "Sabis na Gaggawa",
                        description: "Bayanin lambobin sabis na gaggawa",
                        content:
                            "Don gaggawar rayuwa mai haɗari, kira 199 ko 112.",
                    },
                },
                crisisRelevant: true,
                emergencyContact: {
                    name: "Nigeria Emergency Services",
                    phone: "199 or 112",
                    available: "24/7",
                },
                metadata: {
                    tags: ["emergency", "police", "ambulance", "fire"],
                    author: "SautiCare",
                    source: "Official Emergency Services",
                },
            },
            // Coping Resources
            {
                title: "Deep Breathing Exercise",
                description:
                    "A simple breathing technique to help reduce anxiety and stress",
                content:
                    "1. Sit comfortably and close your eyes. 2. Breathe in slowly through your nose for 4 counts. 3. Hold your breath for 4 counts. 4. Breathe out slowly through your mouth for 6 counts. 5. Repeat 5-10 times.",
                type: "exercise",
                category: "coping",
                languages: ["en", "pidgin", "hausa"],
                translations: {
                    en: {
                        title: "Deep Breathing Exercise",
                        description:
                            "A simple breathing technique to help reduce anxiety and stress",
                        content:
                            "1. Sit comfortably and close your eyes. 2. Breathe in slowly through your nose for 4 counts. 3. Hold your breath for 4 counts. 4. Breathe out slowly through your mouth for 6 counts. 5. Repeat 5-10 times.",
                    },
                    pidgin: {
                        title: "Deep Breathing Exercise",
                        description:
                            "Simple breathing technique wey go help reduce anxiety and stress",
                        content:
                            "1. Sit down well well and close your eyes. 2. Breathe in slowly through your nose for 4 counts. 3. Hold your breath for 4 counts. 4. Breathe out slowly through your mouth for 6 counts. 5. Repeat 5-10 times.",
                    },
                    hausa: {
                        title: "Aikin Numfashi Mai Zurfi",
                        description:
                            "Hanyar numfashi mai sauƙi don taimakawa rage damuwa da damuwa",
                        content:
                            "1. Zauna cikin kwanciyar hankali kuma rufe idanunku. 2. Shaka a hankali ta hancin ku na ƙidaya 4. 3. Rike numfashin ku na ƙidaya 4. 4. Fitar da shaka a hankali ta bakin ku na ƙidaya 6. 5. Maimaita sau 5-10.",
                    },
                },
                metadata: {
                    duration: 5,
                    difficulty: "beginner",
                    ageGroup: "all",
                    tags: ["breathing", "anxiety", "stress", "relaxation"],
                    author: "SautiCare",
                    source: "Mental Health Resources",
                },
            },
            {
                title: "Grounding Technique - 5-4-3-2-1",
                description:
                    "A grounding technique to help with anxiety and panic attacks",
                content:
                    "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring your focus to the present moment.",
                type: "exercise",
                category: "coping",
                languages: ["en", "pidgin", "hausa"],
                translations: {
                    en: {
                        title: "Grounding Technique - 5-4-3-2-1",
                        description:
                            "A grounding technique to help with anxiety and panic attacks",
                        content:
                            "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring your focus to the present moment.",
                    },
                    pidgin: {
                        title: "Grounding Technique - 5-4-3-2-1",
                        description:
                            "Grounding technique wey go help with anxiety and panic attacks",
                        content:
                            "Name 5 things wey you fit see, 4 things wey you fit touch, 3 things wey you fit hear, 2 things wey you fit smell, and 1 thing wey you fit taste. This go help bring your focus to the present moment.",
                    },
                    hausa: {
                        title: "Dabarar Kasa - 5-4-3-2-1",
                        description:
                            "Dabarar kasa don taimakawa tare da damuwa da firgita",
                        content:
                            "Sunanta abubuwa 5 da za ku iya gani, abubuwa 4 da za ku iya taɓa, abubuwa 3 da za ku iya ji, abubuwa 2 da za ku iya wari, da abu 1 da za ku iya ɗanɗana. Wannan yana taimakawa kawo hankalin ku zuwa lokacin yanzu.",
                    },
                },
                metadata: {
                    duration: 3,
                    difficulty: "beginner",
                    ageGroup: "all",
                    tags: ["grounding", "anxiety", "panic", "mindfulness"],
                    author: "SautiCare",
                    source: "Mental Health Resources",
                },
            },
            // General Mental Health Resources
            {
                title: "Understanding Anxiety",
                description: "Learn about anxiety and common symptoms",
                content:
                    "Anxiety is a normal emotion, but when it becomes excessive and persistent, it can interfere with daily life. Common symptoms include restlessness, fatigue, difficulty concentrating, irritability, muscle tension, and sleep disturbances.",
                type: "article",
                category: "anxiety",
                languages: ["en", "pidgin", "hausa"],
                translations: {
                    en: {
                        title: "Understanding Anxiety",
                        description: "Learn about anxiety and common symptoms",
                        content:
                            "Anxiety is a normal emotion, but when it becomes excessive and persistent, it can interfere with daily life. Common symptoms include restlessness, fatigue, difficulty concentrating, irritability, muscle tension, and sleep disturbances.",
                    },
                    pidgin: {
                        title: "Understanding Anxiety",
                        description: "Learn about anxiety and common symptoms",
                        content:
                            "Anxiety na normal emotion, but when e become excessive and persistent, e fit interfere with daily life. Common symptoms include restlessness, fatigue, difficulty concentrating, irritability, muscle tension, and sleep disturbances.",
                    },
                    hausa: {
                        title: "Fahimtar Damuwa",
                        description: "Koyo game da damuwa da alamun gama gari",
                        content:
                            "Damuwa wani yanayi ne na yau da kullum, amma idan ta zama mai yawa da dagewa, za ta iya shafar rayuwar yau da kullum. Alamun gama gari sun haɗa da rashin natsuwa, gajiya, wahalar maida hankali, fushi, tashin tsokoki, da rikicewar barci.",
                    },
                },
                metadata: {
                    difficulty: "beginner",
                    ageGroup: "all",
                    tags: ["anxiety", "education", "symptoms", "mental-health"],
                    author: "SautiCare",
                    source: "Mental Health Education",
                },
            },
        ];

        await Resource.insertMany(resources);
        logger.info(`${resources.length} resources seeded successfully`);
    } catch (error) {
        logger.error("Error seeding resources:", error);
        throw error;
    }
};

module.exports = { seedResources };
