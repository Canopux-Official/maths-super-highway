export interface LinkedInRecommendation {
    id: string;
    name: string;
    profileUrl?: string;      // leave out if there is no public profile
    headline: string;
    relation: string;
    context?: string;
    date?: string;         // shows stars when present
    source?: "linkedin" | "other";   // defaults to "linkedin"
    sourceLabel?: string;     // footer text for non-LinkedIn reviews
    sourceUrl?: string;       // link to the original review page, if public
    message: string;
}

// Paste Mukesh's LinkedIn profile URL here. The "See all recommendations on LinkedIn" button stays hidden until this is filled.
export const LINKEDIN_PROFILE_URL = "";

// Newest first
export const linkedinRecommendations: LinkedInRecommendation[] = [
    {
        id: "kshitij-dabhade",
        name: "Kshitij Dabhade",
        profileUrl: "https://www.linkedin.com/in/kshitij-dabhade-414b8172/",
        headline: "CEO at Eclat Infotainment Pvt Ltd",
        relation: "Parent of an IGCSE student",
        context: "IGCSE Additional Maths",
        date: "April 1, 2026",
        message: `Mukes Sir Taught Ad Maths to my Son.Mukesh sir is very good in Explaining difficult concepts to Students.He is very dedicated Maths teacher.We highly recommend him for Maths for IGCSE Board.`,
    },
    {
        id: "ganesh-ghanekar",
        name: "Ganesh Ghanekar",
        profileUrl: "https://www.linkedin.com/in/ganesh-ghanekar/",
        headline: "Chartered Accountant | Ex-EY | Ex-KPMG",
        relation: "Parent of an IGCSE student",
        context: "IGCSE Additional Mathematics 0606",
        date: "March 27, 2026",
        message: `My son was a bit overwhelmed with Additional Math, although he has been a remarkable student all his life. I found Mukesh Srivastava Sir as a perfect guide and mentor to my son. His approach towards teaching is very robust and holistic. He first understood my son's temperament and level of knowledge instead of directly proceeding with his teaching. My son has improved after taking classes and he is more confident in solving problems on his own. Sir, thank you very much for the structured approach and clear feedback which helped him from struggling to excelling. More so, thank you for being patient!`,
    },
    {
        id: "syeda-suha-shumaylah",
        name: "Syeda Suha Shumaylah",
        profileUrl: "https://www.linkedin.com/in/syeda-suha-shumaylah-227b062a6/",
        headline: "Bachelor of Business Administration (BBA) at BRAC University",
        relation: "Student",
        context: "IBDP Mathematics",
        date: "January 7, 2025",
        message: `I have been fortunate to learn from Mr. Mukesh Srivastava since grade 11 when I started IBDP, and now that I’m in grade 12, I can confidently say that he has been a key factor in my academic growth in mathematics. His clear and structured teaching style, combined with his ability to make complex topics engaging, has truly transformed how I approach math.

Mr. Mukesh is incredibly interactive, always encouraging questions and creating a supportive learning environment. He consistently goes the extra mile to ensure that I not only understand the material but also enjoy the learning process. His dedication, patience, and personalized attention to each student’s needs make him stand out as a tutor.
Thanks to his guidance, I have not only improved my grades but also developed a genuine interest in math. I highly recommend him for anyone looking for an exceptional math tutor!… more`,
    },
    {
        id: "syed-adib-islam",
        name: "Syed Adib Islam",
        profileUrl: "https://www.linkedin.com/in/syed-adib-islam-b04181201/",
        headline: "Finance Intern at DIC Asia Pacific",
        relation: "Client",
        date: "January 3, 2025",
        message: `Mukesh Sir is an incredible teacher and an amazing mentor. His passion for math is very visible as he helps his students throught he toughest of problems. He has always had a very high standard for himself and his students. His passion and dedication inspires and motivates everyone who has the opportunity to work with him.`,
    },
    {
        id: "prameela-satish",
        name: "Prameela Satish",
        profileUrl: "https://www.linkedin.com/in/prameela-satish-5513b015/",
        headline: "Educational Leader | Founding Principal | Cambridge International School Leader",
        relation: "Principal (managed Mukesh directly)",
        date: "August 1, 2024",
        message: `Mukesh has excellent content mastery on his subject. He is extremely passionate about Math and can go any extent in helping students understand the concepts and also make them love the subject. He always sets high standards for himself as well as his students. 
As a team member. he always has this stand that he is cordial with everyone and close to none. With  this mindset , he cooperates with all his colleagues in various activities planned in school in the interest of student growth and learning. 
Mukesh is also passionate about debating and always wished to have a debate club while associated with JBCN. 
His long term goal is to tutor for Math to students of various boards across the world. 

My best wishes to Mukesh for all his future endeavours.`,
    },
    {
        id: "sathish",
        name: "Sathish",
        headline: "Maths student",
        relation: "Student",
        source: "other",
        sourceLabel: "Student review",
        sourceUrl: "",
        message: `Mukesh’s teaching bring me back my childhood days back in India . Full of domain expertise and knowledge. Amazing teaching experience , patience , unique way of exploring how to find the challenge the student is experiencing and focusing on that to improve . Just amazing and recommmend anyone who is interested in deep Maths to get to him and good luck in getting him to be part of child’s growth`,
    },
];