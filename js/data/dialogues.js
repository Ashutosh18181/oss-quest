/**
 * OSS Quest — NPC Dialogue Scripts
 * Chapter content delivered as RPG dialogue conversations.
 * Includes complete localized scripts for English (en), Hindi (hi), and Odia (od).
 */

import { getJargonDefinition } from './jargon.js';

export const DIALOGUE_SCRIPTS = {
    borin: {
        chapterId: 1,
        xpReward: 50,
        nodes: [
            {
                text: "Ah, a newcomer to the Forge! I'm Borin — I keep every tool tracked and every change recorded. Nothing is ever lost here.",
                text_hi: "आह, फ़ोर्ज (The Forge) में नया मुसाफ़िर! मैं बोरिन हूँ — मैं यहाँ हर औज़ार और हर बदलाव का पूरा हिसाब रखता हूँ। यहाँ कुछ भी कभी खोता नहीं।",
                text_od: "ଫୋର୍ଜକୁ ସ୍ୱାଗତ! ମୁଁ ବୋରିନ୍ — ମୁଁ ଏଠାରେ ପ୍ରତ୍ୟେକ ଟୁଲ୍ ଏବଂ ପ୍ରତ୍ୟେକ ପରିବର୍ତ୍ତନ ହିସାବ ରଖେ। ଏଠାରେ କିଛି ବି ହଜିଯାଏ ନାହିଁ।",
                choices: [
                    { label: "What do you mean, tracked?", label_hi: "हिसाब रखने से आपका क्या मतलब है?", label_od: "ହିସାବ ରଖିବା ମାନେ କ'ଣ?", next: 1 },
                    { label: "How does that help me?", label_hi: "यह मेरी कैसे मदद करेगा?", label_od: "ଏହା ମୋତେ କିପରି ସାହାଯ୍ୟ କରିବ?", next: 1 },
                    { label: "Show me.", label_hi: "मुझे दिखाइए।", label_od: "ମୋତେ ଦେଖାନ୍ତୁ।", next: 1 },
                ],
            },
            {
                text: "Imagine you're writing a story with friends. Everyone has their own copy, but you need one \"true\" version everyone agrees on. That's what ~version control~ does for code — it keeps one shared history so nobody overwrites anyone else's work.",
                text_hi: "कल्पना कीजिए कि आप दोस्तों के साथ एक कहानी लिख रहे हैं। सबके पास अपनी कॉपी है, लेकिन एक ऐसी असली कॉपी चाहिए जिस पर सब सहमत हों। कोड के लिए ~version control~ यही करता है — यह एक साझा इतिहास रखता है ताकि कोई किसी और का काम न मिटा दे।",
                text_od: "କଳ୍ପନା କରନ୍ତୁ ଆପଣ ସାଙ୍ଗମାନଙ୍କ ସହ ଗପ ଲେଖୁଛନ୍ତି। ସମସ୍ତଙ୍କ ପାଖରେ କପି ଅଛି, କିନ୍ତୁ ଗୋଟିଏ 'ଅସଲ' ସଂସ୍କରଣ ଦରକାର। କୋଡ୍ ପାଇଁ ~version control~ ଏହି କାମ କରେ — ଏହା ଗୋଟିଏ ଇତିହାସ ରଖେ ଯାହା ଦ୍ୱାରା କେହି ଅନ୍ୟର କାମ ନଷ୍ଟ ନକରନ୍ତି।",
                jargon: 'version-control',
            },
            {
                text: "See this anvil? Every strike I make changes the metal. But what if I strike wrong? With the right tool, I can undo any strike and go back to how it was before.",
                text_hi: "इस निहाई (anvil) को देखिए? मेरी हर चोट धातु को बदल देती है। लेकिन अगर मुझसे गलत चोट लग जाए तो? सही टूल के साथ, मैं किसी भी चोट को पूर्ववत (undo) करके पहले जैसी स्थिति में ला सकता हूँ।",
                text_od: "ଏହି ଅସ୍ତ୍ରଶାଳାକୁ ଦେଖନ୍ତୁ? ମୋର ପ୍ରତ୍ୟେକ ଆଘାତ ଲୁହାକୁ ବଦଳାଇ ଦିଏ। କିନ୍ତୁ ଭୁଲ ଆଘାତ ହେଲେ? ସଠିକ୍ ଟୁଲ୍ ସାହାଯ୍ୟରେ ମୁଁ ଯେକୌଣସି ଭୁଲକୁ ସୁଧାରି ପୁରୁଣା ସ୍ଥିତିକୁ ଫେରିପାରିବି।",
                choices: [
                    { label: "So it's like a save point?", label_hi: "तो यह गेम के सेव पॉइंट (save point) जैसा है?", label_od: "ଏହା କ'ଣ ସେଭ୍ ପଏଣ୍ଟ ପରି?", next: 3 },
                    { label: "What tool does that?", label_hi: "वह कौन सा टूल है?", label_od: "ସେହି ଟୁଲ୍ କ'ଣ?", next: 3 },
                ],
            },
            {
                text: "Exactly! The tool is called ~Git~. It runs right here on your machine. Every time you save a snapshot of your work, Git remembers exactly what changed, when, and who did it.",
                text_hi: "बिल्कुल! उस टूल का नाम है ~Git~। यह सीधे आपके कंप्यूटर पर चलता है। हर बार जब आप अपने काम का एक स्नैपशॉट सेव करते हैं, तो Git याद रखता है कि क्या बदला, कब बदला, और किसने बदला।",
                text_od: "ଏକଦମ୍ ସଠିକ୍! ସେହି ଟୁଲ୍ ହେଉଛି ~Git~। ଏହା ଆପଣଙ୍କ କମ୍ପ୍ୟୁଟରରେ ଚାଲେ। ଯେବେ ବି ଆପଣ ସ୍ନାପସଟ୍ ସେଭ୍ କରନ୍ତି, Git ମନେ ରଖେ କ'ଣ ବଦଳିଲା, କେବେ ଏବଂ କିଏ କଲା।",
                jargon: 'git',
            },
            {
                text: "These snapshots are called ~commits~. Think of each commit as a checkpoint. You can always go back to any earlier checkpoint — nothing is ever truly lost.",
                text_hi: "इन स्नैपशॉट्स को ~commits~ कहा जाता है। हर कमिट को एक चेकपॉइंट समझें। आप हमेशा किसी भी पुराने चेकपॉइंट पर वापस जा सकते हैं — यहाँ कुछ भी कभी खोता नहीं।",
                text_od: "ଏହି ସ୍ନାପସଟ୍ ଗୁଡ଼ିକୁ ~commits~ କୁହାଯାଏ। ପ୍ରତ୍ୟେକ କମିଟ୍ ଏକ ଚେକପଏଣ୍ଟ ପରି। ଆପଣ ସବୁବେଳେ ପୁରୁଣା ଚେକପଏଣ୍ଟକୁ ଫେରିପାରିବେ — ଏଠାରେ କିଛି ବି ହଜିଯାଏ ନାହିଁ।",
                jargon: 'commit',
            },
            {
                text: "Now, the Forge is just my workshop. But there's a public shelf where every smith in the land shares their work. That's ~GitHub~ — a website where people store their Git projects so others can see and contribute to them.",
                text_hi: "अब, यह फ़ोर्ज तो सिर्फ मेरी वर्कशॉप है। लेकिन एक सार्वजनिक अलमारी भी है जहाँ पूरी दुनिया के डेवलपर्स अपना काम शेयर करते हैं। वह है ~GitHub~ — एक ऐसी वेबसाइट जहाँ लोग अपने Git प्रोजेक्ट्स रखते हैं ताकि दूसरे उन्हें देख सकें और योगदान कर सकें।",
                text_od: "ଏହି ଫୋର୍ଜ ମୋର କର୍ମଶାଳା। କିନ୍ତୁ ଏକ ସାର୍ବଜନୀନ ସ୍ଥାନ ଅଛି ଯେଉଁଠାରେ ସମସ୍ତେ ନିଜ କାମ ସେୟାର କରନ୍ତି। ତାହା ହେଉଛି ~GitHub~ — ଏପରି ଏକ ୱେବସାଇଟ୍ ଯେଉଁଠାରେ ଲୋକମାନେ ନିଜ Git ପ୍ରୋଜେକ୍ଟ ସାଇତି ରଖନ୍ତି।",
                jargon: 'github',
            },
            {
                text: "A project on GitHub is called a ~repository~ — or \"repo\" for short. It's just a folder tracked by Git. It has the code, the full history of changes, and usually a ~README~ file that explains what the project is about.",
                text_hi: "GitHub पर किसी प्रोजेक्ट को ~repository~ — या संक्षेप में 'repo' कहा जाता है। यह Git द्वारा ट्रैक किया गया एक फ़ोल्डर है। इसमें कोड, हर बदलाव का इतिहास और एक ~README~ फ़ाइल होती है जो बताती है कि प्रोजेक्ट क्या है।",
                text_od: "GitHub ରେ ଏକ ପ୍ରୋଜେକ୍ଟକୁ ~repository~ କୁହାଯାଏ। ଏଥିରେ କୋଡ୍, ପରିବର୍ତ୍ତନ ଇତିହାସ ଏବଂ ସାଧାରଣତଃ ଏକ ~README~ ଫାଇଲ୍ ଥାଏ ଯାହା ପ୍ରୋଜେକ୍ଟ ବିଷୟରେ ବୁଝାଏ।",
                jargon: 'repository',
                choices: [
                    { label: "That makes sense.", label_hi: "समझ आ गया।", label_od: "ବୁଝିପାରିଲି।", next: 7 },
                    { label: "What's a README?", label_hi: "README क्या होता है?", label_od: "README କ'ଣ?", next: 7 },
                ],
            },
            {
                text: "A ~README~ is the first thing you read when you open a project. It's the map — it tells you what the project does, how to set it up, and how to contribute. Always read the README first.",
                text_hi: "एक ~README~ वह पहली चीज़ है जिसे आप प्रोजेक्ट खोलते ही पढ़ते हैं। यह आपका नक्शा है — यह बताता है कि प्रोजेक्ट क्या करता है, इसे कैसे सेट अप करें, और कैसे contribute करें। हमेशा पहले README पढ़ें।",
                text_od: "~README~ ହେଉଛି ଆପଣଙ୍କ ମାନଚିତ୍ର — ଏହା ପ୍ରୋଜେକ୍ଟ କ'ଣ କରେ, କିପରି ସେଟଅପ୍ କରିବେ ଏବଂ କିପରି ଯୋଗଦାନ କରିବେ ତାହା ବୁଝାଏ। ସର୍ବଦା ପ୍ରଥମେ README ପଢନ୍ତୁ।",
                jargon: 'readme',
            },
            {
                text: "You've got the basics of the Forge now! Git tracks your changes. GitHub shares them. A repository is your project folder. And the README is your map.\n\nHead to the Scriptorium and speak with Elda — she'll teach you about making your own copy of someone else's work.",
                text_hi: "अब आप फ़ोर्ज की बुनियादी बातें सीख चुके हैं! Git आपके बदलावों को ट्रैक करता है, GitHub उन्हें शेयर करता है, रिपॉजिटरी आपका फ़ोल्डर है, और README आपका नक्शा है।\n\nअब स्क्रिप्टोरियम जाइए और एल्डा (Elda) से मिलिए — वह आपको दूसरों के काम की कॉपी बनाना सिखाएंगी।",
                text_od: "ଆପଣ ଫୋର୍ଜର ମୌଳିକ କଥା ଶିଖିଗଲେ! Git ପରିବର୍ତ୍ତନ ଟ୍ରାକ୍ କରେ, GitHub ସେୟାର କରେ ଏବଂ README ହେଉଛି ମାନଚିତ୍ର।\n\nଏବେ ସ୍କ୍ରିପ୍ଟୋରିୟମ ଯାଇ ଏଲଡାଙ୍କୁ ଭେଟନ୍ତୁ — ସେ ନିଜ କପି ତିଆରି କରିବା ଶିଖାଇବେ।",
                questComplete: true,
            },
        ],
    },

    elda: {
        chapterId: 2,
        xpReward: 75,
        nodes: [
            {
                text: "Welcome, student. I am Elda, keeper of the Scriptorium. Here, we practice the art of making copies — perfect, independent copies you can change freely without affecting the original.",
                text_hi: "स्वागत है, शिक्षार्थी। मैं एल्डा हूँ, स्क्रिप्टोरियम (The Scriptorium) की संरक्षिका। यहाँ हम कॉपियाँ बनाने की कला सीखते हैं — ऐसी स्वतंत्र कॉपियाँ जिन्हें आप मूल प्रोजेक्ट को प्रभावित किए बिना आज़ादी से बदल सकते हैं।",
                text_od: "ସ୍ୱାଗତ, ଶିକ୍ଷାର୍ଥୀ। ମୁଁ ଏଲଡା, ସ୍କ୍ରିପ୍ଟୋରିୟମର ସଂରକ୍ଷକ। ଏଠାରେ ଆମେ କପି ତିଆରି କରିବା ଶିଖୁ — ସ୍ୱତନ୍ତ୍ର କପି ଯାହାକୁ ଆପଣ ମୂଳ ପ୍ରୋଜେକ୍ଟ ନଷ୍ଟ ନକରି ବଦଳାଇ ପାରିବେ।",
                choices: [
                    { label: "Why would I copy someone's work?", label_hi: "मैं किसी और के काम की कॉपी क्यों बनाऊँ?", label_od: "ମୁଁ ଅନ୍ୟ କାମର କପି କାହିଁକି କରିବି?", next: 1 },
                    { label: "Teach me.", label_hi: "मुझे सिखाइए।", label_od: "ମୋତେ ଶିଖାନ୍ତୁ।", next: 1 },
                ],
            },
            {
                text: "A ~fork~ is your personal copy of someone else's repository on GitHub. It lives under your own account, so you can change anything you want without affecting the original project.",
                text_hi: "एक ~fork~ GitHub पर किसी और की रिपॉजिटरी की आपकी अपनी व्यक्तिगत कॉपी होती है। यह आपके अकाउंट में रहती है, इसलिए आप मूल प्रोजेक्ट को छेड़े बिना जो चाहें बदल सकते हैं।",
                text_od: "ଏକ ~fork~ ହେଉଛି GitHub ରେ ଅନ୍ୟ କାହାର ରିପୋଜିଟୋରୀର ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ କପି। ଏହା ଆପଣଙ୍କ ଆକାଉଣ୍ଟରେ ରହେ, ତେଣୁ ଆପଣ ମୂଳ ପ୍ରୋଜେକ୍ଟକୁ କ୍ଷତି ନପହଞ୍ଚାଇ ଯାହା ଇଚ୍ଛା ବଦଳାଇ ପାରିବେ।",
                jargon: 'fork',
            },
            {
                text: "Think of it like photocopying a library book — the original stays on the shelf, but now you have your own copy to scribble notes in.",
                text_hi: "इसे लाइब्रेरी की किताब की फ़ोटोकॉपी की तरह समझें — मूल किताब शेल्फ़ पर ही रहती है, लेकिन आपके पास नोट्स बनाने के लिए आपकी अपनी कॉपी होती है।",
                text_od: "ଏହାକୁ ଲାଇବ୍ରେରୀ ବହିର ଫଟୋକପି ପରି ଭାବନ୍ତୁ — ମୂଳ ବହିଟି ଥାକରେ ରହେ, କିନ୍ତୁ ଆପଣଙ୍କ ପାଖରେ ଟିପ୍ପଣୀ ଲେଖିବା ପାଇଁ ନିଜ କପି ଥାଏ।",
                choices: [
                    { label: "Makes sense. What next?", label_hi: "समझ आ गया। आगे क्या?", label_od: "ବୁଝିଲି। ତା'ପରେ କ'ଣ?", next: 3 },
                    { label: "How do I get it on my computer?", label_hi: "यह मेरे कंप्यूटर पर कैसे आएगी?", label_od: "ଏହା ମୋ କମ୍ପ୍ୟୁଟରକୁ କିପରି ଆସିବ?", next: 3 },
                ],
            },
            {
                text: "~Cloning~ downloads a copy of a repository from GitHub to your own computer. After cloning, you have all the files and the full history right on your machine, ready to explore and edit.",
                text_hi: "~Cloning~ का मतलब है GitHub से रिपॉजिटरी की कॉपी अपने कंप्यूटर पर डाउनलोड करना। क्लोन करने के बाद, सारी फ़ाइलें और पूरा इतिहास आपकी मशीन पर होता है।",
                text_od: "~Cloning~ ର ଅର୍ଥ ହେଉଛି GitHub ରୁ ରିପୋଜିଟୋରୀର ଏକ କପି ନିଜ କମ୍ପ୍ୟୁଟରରେ ଡାଉନଲୋଡ୍ କରିବା। ଏହା ପରେ ସମସ୍ତ ଫାଇଲ୍ ଆପଣଙ୍କ ପାଖରେ ରହେ।",
                jargon: 'clone',
            },
            {
                text: "Here's the typical workflow:\n\n1. Find a project you want to contribute to\n2. Click \"Fork\" on GitHub — now you have your own copy online\n3. Clone your fork to your computer\n4. Make changes locally\n5. Push your changes back up to your fork\n6. Ask the original project to accept your changes",
                text_hi: "यह रहा सामान्य वर्कफ़्लो:\n\n1. एक प्रोजेक्ट खोजें जिसमें योगदान देना है\n2. GitHub पर 'Fork' क्लिक करें — आपकी ऑनलाइन कॉपी तैयार\n3. अपनी फ़ोर्क को कंप्यूटर पर Clone करें\n4. अपने कंप्यूटर पर बदलाव करें\n5. बदलावों को अपनी फ़ोर्क पर Push करें\n6. मूल प्रोजेक्ट से बदलाव स्वीकार (Pull Request) करने का अनुरोध करें",
                text_od: "ଏହା ହେଉଛି ସାଧାରଣ ଧାରା:\n\n୧. ଏକ ପ୍ରୋଜେକ୍ଟ ଖୋଜନ୍ତୁ\n୨. GitHub ରେ 'Fork' କ୍ଲିକ୍ କରନ୍ତୁ\n୩. ନିଜ କମ୍ପ୍ୟୁଟରକୁ Clone କରନ୍ତୁ\n୪. ନିଜେ ପରିବର୍ତ୍ତନ କରନ୍ତୁ\n୫. ପରିବର୍ତ୍ତନକୁ Push କରନ୍ତୁ\n୬. ମୂଳ ପ୍ରୋଜେକ୍ଟକୁ ଗ୍ରହଣ କରିବାକୁ ଅନୁରୋଧ କରନ୍ତୁ",
            },
            {
                text: "Don't worry about doing all that right now — Chapter 5 will match you to a specific project, and Chapter 6 walks you through every step.\n\nFor now, just remember: fork = your online copy, clone = your local copy.\n\nMaren at the Map House can teach you how to actually read the code once you have it.",
                text_hi: "अभी इन सबको सचमुच करने की चिंता न करें — अध्याय 5 आपको एक प्रोजेक्ट से जोड़ेगा और अध्याय 6 हर कदम सिखाएगा।\n\nअभी याद रखें: fork = ऑनलाइन कॉपी, clone = लोकल कॉपी।\n\nमैप हाउस में मारेन (Maren) आपको कोड पढ़ना सिखाएंगी।",
                text_od: "ବର୍ତ୍ତମାନ ଏସବୁ କରିବା ପାଇଁ ବ୍ୟସ୍ତ ହୁଅନ୍ତୁ ନାହିଁ — ଅଧ୍ୟାୟ ୫ ଏକ ପ୍ରୋଜେକ୍ଟ ସହିତ ଯୋଡିବ ଏବଂ ଅଧ୍ୟାୟ ୬ ପ୍ରତ୍ୟେକ ପାଦ ଶିଖାଇବ।\n\nଏବେ ମନେ ରଖନ୍ତୁ: fork = ଅନଲାଇନ୍ କପି, clone = ଲୋକାଲ୍ କପି।\n\nମାରେନଙ୍କୁ ଭେଟନ୍ତୁ — ସେ କୋଡ୍ ପଢିବା ଶିଖାଇବେ।",
                questComplete: true,
            },
        ],
    },

    maren: {
        chapterId: 3,
        xpReward: 100,
        nodes: [
            {
                text: "You look lost. Good — that means you're ready to learn. I'm Maren. I draw maps of places I've never been, just by studying what others left behind. That's what reading code is.",
                text_hi: "तुम भटके हुए लग रहे हो। अच्छा है — इसका मतलब है तुम सीखने के लिए तैयार हो। मैं मारेन हूँ। मैं उन जगहों के नक्शे बनाती हूँ जहाँ मैं कभी नहीं गई, सिर्फ़ दूसरों के छोड़े निशानों को देखकर। कोड पढ़ना भी ऐसा ही है।",
                text_od: "ତୁମେ ବାଟବଣା ଲାଗୁଛ। ଭଲ କଥା — ଏହାର ଅର୍ଥ ତୁମେ ଶିଖିବାକୁ ପ୍ରସ୍ତୁତ। ମୁଁ ମାରେନ୍। ମୁଁ ଅନ୍ୟମାନଙ୍କ ଛାଡ଼ିଥିବା ଚିହ୍ନରୁ ମାନଚିତ୍ର ତିଆରି କରେ। କୋଡ୍ ପଢିବା ମଧ୍ୟ ଠିକ୍ ସେହିପରି।",
                choices: [
                    { label: "Where do I even start?", label_hi: "मैं शुरुआत कहाँ से करूँ?", label_od: "ମୁଁ କେଉଁଠାରୁ ଆରମ୍ଭ କରିବି?", next: 1 },
                    { label: "It all looks like gibberish to me.", label_hi: "यह सब मुझे अजीब लगता है।", label_od: "ଏସବୁ ମୋତେ ବୁଝାପଡୁନି।", next: 1 },
                ],
            },
            {
                text: "Every well-maintained project has a ~README~ file. This is your map. It usually explains what the project does, how to set it up, and how to contribute. Always read this first.",
                text_hi: "हर अच्छे प्रोजेक्ट में एक ~README~ फ़ाइल होती है। यह आपका नक्शा है। यह समझाती है कि प्रोजेक्ट क्या करता है, कैसे चलाएं, और कैसे योगदान दें। हमेशा इसे पहले पढ़ें।",
                text_od: "ପ୍ରତ୍ୟେକ ଭଲ ପ୍ରୋଜେକ୍ଟରେ ଏକ ~README~ ଫାଇଲ୍ ଥାଏ। ଏହା ହିଁ ଆପଣଙ୍କ ମାନଚିତ୍ର। ସର୍ବଦା ପ୍ରଥମେ ଏହାକୁ ହିଁ ପଢନ୍ତୁ।",
                jargon: 'readme',
            },
            {
                text: "Before reading any code, look at the folder names. Most projects organize code into folders like \"src\" (source code), \"tests\", \"docs\" (documentation), and \"config\". The folder names tell you where things live.",
                text_hi: "कोड पढ़ने से पहले, फ़ोल्डर के नाम देखें। ज़्यादातर प्रोजेक्ट्स 'src' (सोर्स कोड), 'tests', 'docs' (डॉक्यूमेंट्स), और 'config' जैसे फ़ोल्डरों में बँटे होते हैं। नाम बताते हैं कि क्या कहाँ रहता है।",
                text_od: "କୌଣସି କୋଡ୍ ପଢିବା ପୂର୍ବରୁ ଫୋଲ୍ଡର ନାମ ଦେଖନ୍ତୁ — 'src', 'tests', 'docs'। ଏହି ନାମଗୁଡ଼ିକ ହିଁ ସୂଚାଇ ଦିଅନ୍ତି କେଉଁ ଜିନିଷ କେଉଁଠାରେ ଅଛି।",
            },
            {
                text: "Every program has a starting point — the file that runs first. In a web project it might be \"index.html\" or \"app.js\". In Python, look for \"main.py\". Finding the entry point shows you how the pieces connect.",
                text_hi: "हर प्रोग्राम का एक शुरुआती बिंदु होता है — वह फ़ाइल जो सबसे पहले चलती है। वेब प्रोजेक्ट में 'index.html' या 'app.js' हो सकती है। पायथन में 'main.py' देखें। एंट्री पॉइंट ढूँढने से समझ आता है कि हिस्से कैसे जुड़े हैं।",
                text_od: "ପ୍ରତ୍ୟେକ ପ୍ରୋଗ୍ରାମର ଏକ ଆରମ୍ଭ ବିନ୍ଦୁ ଥାଏ — ଯେଉଁ ଫାଇଲ୍ ପ୍ରଥମେ ଚାଲେ। ୱେବ୍ ପ୍ରୋଜେକ୍ଟରେ 'index.html' ବା 'app.js', ପାଇଥନରେ 'main.py'।",
                choices: [
                    { label: "What if I still can't understand the code?", label_hi: "अगर फिर भी कोड समझ न आए तो?", label_od: "ଯଦି ତଥାପି କୋଡ୍ ବୁଝି ନହୁଏ?", next: 4 },
                    { label: "How do I know what to fix?", label_hi: "मुझे कैसे पता चलेगा कि क्या ठीक करना है?", label_od: "କ'ଣ ସଜାଡ଼ିବାକୁ ହେବ କିପରି ଜାଣିବି?", next: 4 },
                ],
            },
            {
                text: "~Issues~ on GitHub are where people report bugs and request features. Reading open issues tells you what's broken or missing — and what might be a good place for you to help.",
                text_hi: "GitHub पर ~Issues~ वह जगह हैं जहाँ लोग बग्स रिपोर्ट करते हैं और नए फ़ीचर्स मांगते हैं। खुली हुई issues पढ़ने से पता चलता है कि क्या ठीक करना है — और आप कहाँ मदद कर सकते हैं।",
                text_od: "GitHub ରେ ~Issues~ ହେଉଛି ସେହି ସ୍ଥାନ ଯେଉଁଠାରେ ଲୋକମାନେ ତ୍ରୁଟି ଜଣାନ୍ତି। ଏହାକୁ ପଢିଲେ ଜଣାପଡେ କେଉଁଠି ସାହାଯ୍ୟ କରିହେବ।",
                jargon: 'issue',
            },
            {
                text: "You're learning the cartographer's eye — see the shape of the project, not every line of code.\n\nNow visit Fenwick at the Post. He'll teach you how to talk to the people who built the project — the maintainers.",
                text_hi: "आप नक्शानवीस की नज़र सीख रहे हैं — पूरे प्रोजेक्ट का ढाँचा देखें, हर एक लाइन नहीं।\n\nअब पोस्ट पर फेनविक (Fenwick) से मिलें। वह मेंटेनर्स से बात करना सिखाएंगे।",
                text_od: "ଆପଣ ମାନଚିତ୍ରକାରଙ୍କ ଦୃଷ୍ଟି ଶିଖୁଛନ୍ତି — ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରୋଜେକ୍ଟକୁ ଦେଖନ୍ତୁ।\n\nଏବେ ଫେନୱିକଙ୍କୁ ଭେଟନ୍ତୁ — ସେ ମେଣ୍ଟେନରଙ୍କ ସହ କଥା ହେବା ଶିଖାଇବେ।",
                questComplete: true,
            },
        ],
    },

    fenwick: {
        chapterId: 4,
        xpReward: 100,
        nodes: [
            {
                text: "I carry messages between villages. Fast? Sure. But speed isn't the art — knowing *how* to ask so you actually get an answer, that's what separates a good courier from a lost letter.",
                text_hi: "मैं गाँवों के बीच संदेश पहुँचाता हूँ। तेज़? बिल्कुल। लेकिन गति असली कला नहीं है — सवाल ऐसे पूछना कि जवाब मिले, यही अच्छे संदेशवाहक की पहचान है।",
                text_od: "ମୁଁ ଗାଁ ଗାଁ ମଧ୍ୟରେ ବାର୍ତ୍ତା ବହନ କରେ। ଦ୍ରୁତଗତି ଅସଲ କଳା ନୁହେଁ — ଏପରି ଭାବରେ ପ୍ରଶ୍ନ ପଚାରିବା ଯେପରି ଉତ୍ତର ମିଳିବ, ତାହା ହିଁ ପ୍ରକୃତ କୌଶଳ।",
                choices: [
                    { label: "Who am I asking?", label_hi: "मैं किससे सवाल पूछूँगा?", label_od: "ମୁଁ କାହାକୁ ପଚାରିବି?", next: 1 },
                    { label: "What kind of messages?", label_hi: "किस तरह के संदेश?", label_od: "କେଉଁ ପ୍ରକାରର ବାର୍ତ୍ତା?", next: 1 },
                ],
            },
            {
                text: "A ~maintainer~ is the person or team who manages a project — they review contributions, fix bugs, and decide what gets merged. They're usually volunteers doing this in their free time.",
                text_hi: "एक ~maintainer~ वह व्यक्ति या टीम है जो प्रोजेक्ट को संभालती है — वे योगदान को रिव्यू करते हैं, बग्स ठीक करते हैं, और तय करते हैं कि क्या शामिल होगा। वे अपने खाली समय में यह काम करते हैं।",
                text_od: "ଏକ ~maintainer~ ହେଉଛନ୍ତି ସେହି ବ୍ୟକ୍ତି ବା ଦଳ ଯିଏ ପ୍ରୋଜେକ୍ଟର ତଦାରଖ କରନ୍ତି — ସେମାନେ ସ୍ୱେଚ୍ଛାସେବୀ ଭାବରେ କାମ କରନ୍ତି।",
                jargon: 'maintainer',
            },
            {
                text: "Most projects have a ~contributing guide~ — a CONTRIBUTING.md file that explains how they want you to contribute. Reading this before asking a question shows respect for their time and process.",
                text_hi: "ज़्यादातर प्रोजेक्ट्स में एक ~contributing guide~ (CONTRIBUTING.md) होती है जो बताती है कि वे कैसे योगदान चाहते हैं। सवाल पूछने से पहले इसे पढ़ना उनके समय का सम्मान दिखाता है।",
                text_od: "ଅଧିକାଂଶ ପ୍ରୋଜେକ୍ଟରେ ~contributing guide~ ଥାଏ। ପ୍ରଶ୍ନ ପଚାରିବା ପୂର୍ବରୁ ଏହାକୁ ପଢିବା ସେମାନଙ୍କ ସମୟ ପ୍ରତି ସମ୍ମାନ ଦର୍ଶାଏ।",
                jargon: 'contributing-guide',
            },
            {
                text: "When commenting on an issue:\n\n• Say what you tried and what happened\n• Be specific — \"it doesn't work\" isn't helpful\n• Show the exact error message\n• Be polite and patient — responses can take days\n• Say thank you when someone helps",
                text_hi: "किसी issue पर टिप्पणी (comment) करते समय:\n\n• बताएं कि आपने क्या आज़माया और क्या हुआ\n• स्पष्ट रहें — सिर्फ 'यह काम नहीं कर रहा' से मदद नहीं मिलती\n• सटीक एरर मैसेज दिखाएं\n• विनम्र और धैर्यवान रहें\n• मदद मिलने पर धन्यवाद ज़रूर कहें",
                text_od: "ମନ୍ତବ୍ୟ ଦେବା ସମୟରେ:\n\n• ଆପଣ କ'ଣ ଚେଷ୍ଟା କଲେ ତାହା କୁହନ୍ତୁ\n• ନିର୍ଦ୍ଦିଷ୍ଟ ଭାବରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ\n• ତ୍ରୁଟି ବାର୍ତ୍ତା ଦର୍ଶାନ୍ତୁ\n• ଧୈର୍ଯ୍ୟ ରଖନ୍ତୁ ଏବଂ କୃତଜ୍ଞତା ଜଣାନ୍ତୁ",
                choices: [
                    { label: "How do I claim an issue to work on?", label_hi: "मैं काम करने के लिए issue कैसे माँगूँ?", label_od: "ମୁଁ କାମ କରିବା ପାଇଁ issue କିପରି ମାଗିବି?", next: 4 },
                    { label: "What if nobody responds?", label_hi: "अगर कोई जवाब न दे तो?", label_od: "ଯଦି କେହି ଉତ୍ତର ନଦିଅନ୍ତି?", next: 4 },
                ],
            },
            {
                text: "If you want to work on an issue, leave a comment saying \"I'd like to work on this.\" Some projects use labels like ~good first issue~ to mark tasks suitable for newcomers. Wait for a maintainer to acknowledge before starting.",
                text_hi: "अगर आप किसी issue पर काम करना चाहते हैं, तो लिखें: 'I would like to work on this.' कुछ प्रोजेक्ट्स नए लोगों के लिए ~good first issue~ लेबल लगाते हैं। काम शुरू करने से पहले मेंटेनर की मंज़ूरी का इंतज़ार करें।",
                text_od: "ଯଦି କାମ କରିବାକୁ ଚାହାଁନ୍ତି, ତେବେ 'I would like to work on this' ଲେଖନ୍ତୁ। ~good first issue~ ଲେବଲ୍ ଥିବା ଟାସ୍କ ବାଛନ୍ତୁ ଏବଂ ଅପେକ୍ଷା କରନ୍ତୁ।",
                jargon: 'good-first-issue',
            },
            {
                text: "Patience and clarity — those are the courier's tools.\n\nNow climb to the Watchtower and speak with Sage Oren. He watches every village in the land, and he can find the one that needs *your* help most.",
                text_hi: "धैर्य और स्पष्टता — यही आपके औज़ार हैं।\n\nअब वॉचटावर पर सेज ओरेन (Sage Oren) से मिलें। वे आपके कौशल के अनुसार सबसे सही प्रोजेक्ट खोजेंगे।",
                text_od: "ଧୈର୍ଯ୍ୟ ଏବଂ ସ୍ପଷ୍ଟତା ହିଁ ଆପଣଙ୍କ ଅସ୍ତ୍ର।\n\nଏବେ ସେଜ୍ ଓରେନଙ୍କୁ ଭେଟନ୍ତୁ — ସେ ଆପଣଙ୍କ ପାଇଁ ଉପଯୁକ୍ତ ପ୍ରୋଜେକ୍ଟ ଖୋଜିବେ।",
                questComplete: true,
            },
        ],
    },

    oren: {
        chapterId: 5,
        xpReward: 150,
        isCampTrigger: true,
        nodes: [
            {
                text: "From this tower I see every village, every forge, every scriptorium in the land. I know which ones need help, which ones welcome strangers, and which ones will answer when you knock.",
                text_hi: "इस मीनार से मैं हर गाँव, हर फ़ोर्ज, हर वर्कशॉप देख सकता हूँ। मुझे पता है कि किसे मदद चाहिए, कौन नए लोगों का स्वागत करता है, और कौन दस्तक देने पर जवाब देगा।",
                text_od: "ଏହି ମୀନାରରୁ ମୁଁ ସମସ୍ତ ସ୍ଥାନ ଦେଖିପାରେ। ମୁଁ ଜାଣେ କାହାକୁ ସାହାଯ୍ୟ ଦରକାର ଏବଂ କିଏ ନୂତନ ଲୋକଙ୍କୁ ସ୍ୱାଗତ କରେ।",
                choices: [
                    { label: "Can you find one for me?", label_hi: "क्या आप मेरे लिए एक प्रोजेक्ट ढूँढ सकते हैं?", label_od: "ମୋ ପାଇଁ ଗୋଟିଏ ଖୋଜିପାରିବେ କି?", next: 1 },
                    { label: "How does the matching work?", label_hi: "यह मैचिंग कैसे काम करती है?", label_od: "ଏହି ମ୍ୟାଚିଂ କିପରି କାମ କରେ?", next: 1 },
                ],
            },
            {
                text: "I look at real, active projects and score them on three things:\n\n• Language fit — does it use a language you know or are learning?\n• Difficulty — are there issues labeled for beginners?\n• Maintainer responsiveness — does someone actually respond when contributors ask?",
                text_hi: "मैं असली प्रोजेक्ट्स को तीन पैमानों पर आँकता हूँ:\n\n• भाषा — क्या यह आपकी चुनी हुई भाषा में है?\n• सरलता — क्या इसमें नए लोगों के लिए beginner issues हैं?\n• मेंटेनर सक्रियता — क्या सवाल पूछने पर सक्रिय रूप से जवाब मिलता है?",
                text_od: "ମୁଁ ପ୍ରକୃତ ପ୍ରୋଜେକ୍ଟଗୁଡ଼ିକୁ ୩ଟି ବିଷୟ ଉପରେ ପରଖେ:\n\n• ଭାଷା ଅନୁକୂଳତା\n• ସରଳତା (Beginner Friendly)\n• ମେଣ୍ଟେନରଙ୍କ ସକ୍ରିୟତା",
            },
            {
                text: "Watch the clearing below. I'll scan a real repository — you'll see each piece of information become a structure on the map as I discover it.",
                text_hi: "नीचे खाली मैदान को देखिए। मैं एक असली रिपॉजिटरी को स्कैन करूँगा — जैसे-जैसे जानकारी मिलेगी, वह नक्शे पर एक इमारत बन जाएगी।",
                text_od: "ତଳେ ଥିବା ଖାଲି ସ୍ଥାନକୁ ଦେଖନ୍ତୁ। ମୁଁ ଏକ ପ୍ରକୃତ ରିପୋଜିଟୋରୀ ସ୍କାନ୍ କରୁଛି — ପ୍ରତ୍ୟେକ ତଥ୍ୟ ଏକ ସୌଧ ରୂପେ ଦେଖାଯିବ।",
                triggerCamp: true,
            },
            {
                text: "Your match is ready. Every score is visible — no black box, no guessing. You can see exactly why this project was chosen for you.\n\nWhen you're ready for your first real contribution, speak with Captain Voss at the Gate.",
                text_hi: "आपका मैच तैयार है! हर स्कोर साफ़ दिख रहा है — कोई रहस्य नहीं। आप देख सकते हैं कि यह प्रोजेक्ट आपके लिए क्यों चुना गया।\n\nजब आप अपने पहले असली योगदान के लिए तैयार हों, तो गेट पर कैप्टन वॉस (Captain Voss) से मिलें।",
                text_od: "ଆପଣଙ୍କ ମ୍ୟାଚ୍ ପ୍ରସ୍ତୁତ! ସମସ୍ତ ସ୍କୋର ସ୍ପଷ୍ଟ।\n\nଏବେ ଗେଟ୍ ପାଖରେ କ୍ୟାପଟେନ ଭସ୍ (Voss) ଙ୍କୁ ଭେଟନ୍ତୁ।",
                questComplete: true,
            },
        ],
    },

    voss: {
        chapterId: 6,
        xpReward: 200,
        nodes: [
            {
                text: "You've trained well, traveler. I am Voss, and I guard this gate. Beyond it lies the world of open source — real projects, real people, real contributions. I'll show you how to step through.",
                text_hi: "तुमने अच्छा अभ्यास किया है, मुसाफ़िर। मैं वॉस हूँ, और मैं इस फाटक की रक्षा करता हूँ। इसके पार ओपन सोर्स की दुनिया है — असली प्रोजेक्ट्स, असली लोग, असली योगदान। मैं तुम्हें कदम बढ़ाना सिखाऊंगा।",
                text_od: "ଆପଣ ଭଲ ଅଭ୍ୟାସ କରିଛନ୍ତି। ମୁଁ ଭସ୍, ଏହି ଦ୍ୱାରର ରକ୍ଷକ। ଏହା ଆଗରେ ପ୍ରକୃତ ଓପନ୍ ସୋର୍ସ ଜଗତ ଅଛି। ମୁଁ ଆପଣଙ୍କୁ ବାଟ କଢ଼ାଇ ନେବି।",
                choices: [
                    { label: "I'm ready.", label_hi: "मैं तैयार हूँ।", label_od: "ମୁଁ ପ୍ରସ୍ତୁତ।", next: 1 },
                    { label: "What do I do first?", label_hi: "मुझे सबसे पहले क्या करना होगा?", label_od: "ପ୍ରଥମେ କ'ଣ କରିବାକୁ ହେବ?", next: 1 },
                ],
            },
            {
                text: "A ~pull request~ — or PR — is how you suggest your changes to the original project. The maintainer reviews your code, may suggest edits, and then merges it in.",
                text_hi: "एक ~pull request~ (PR) वह तरीका है जिससे आप मूल प्रोजेक्ट में अपने बदलाव का सुझाव देते हैं। मेंटेनर आपके कोड को रिव्यू करता है, और फिर उसे मुख्य कोड में जोड़ता (merge) है।",
                text_od: "ଏକ ~pull request~ (PR) ମାଧ୍ୟମରେ ଆପଣ ନିଜ କାମକୁ ମୂଳ ପ୍ରୋଜେକ୍ଟରେ ସାମିଲ କରିବା ପାଇଁ ଅନୁରୋଧ କରନ୍ତି।",
                jargon: 'pull-request',
            },
            {
                text: "Here's the step-by-step:\n\n1. Fork the repository\n2. Clone your fork to your computer\n3. Create a new ~branch~ for your change\n4. Make your edit\n5. Commit your change\n6. Push to your fork\n7. Open a PR",
                text_hi: "यह रहा चरणबद्ध तरीका:\n\n1. रिपॉजिटरी को Fork करें\n2. अपनी फ़ोर्क को Clone करें\n3. बदलाव के लिए नई ~branch~ बनाएं\n4. कोड एडिट करें\n5. बदलाव को Commit करें\n6. अपनी फ़ोर्क पर Push करें\n7. Pull Request खोलें",
                text_od: "ଏହି ପଦକ୍ଷେପଗୁଡ଼ିକ ଅନୁସରଣ କରନ୍ତୁ:\n\n୧. Fork କରନ୍ତୁ\n୨. Clone କରନ୍ତୁ\n୩. ନୂଆ ~branch~ ତିଆରି କରନ୍ତୁ\n୪. Edit କରନ୍ତୁ\n୫. Commit କରନ୍ତୁ\n୬. Push କରନ୍ତୁ\n୭. PR ଖୋଲନ୍ତୁ",
                jargon: 'branch',
            },
            {
                text: "Let's practice the mechanics right now on the simulated terminal. I'll load up the repository you just matched with, and you'll walk through the commands.",
                text_hi: "आइए सिमुलेटेड टर्मिनल पर इसका अभ्यास करें। मैं आपका मैच किया हुआ प्रोजेक्ट लोड करूँगा, और आप कमांड्स चलाकर अभ्यास करेंगे।",
                text_od: "ଆସନ୍ତୁ ଟର୍ମିନାଲ୍ ରେ ଏହାର ଅଭ୍ୟାସ କରିବା। ଆପଣ କମାଣ୍ଡ ଟାଇପ୍ କରି ଶିଖିବେ।",
                triggerTerminal: true,
            },
            {
                text: "Excellent work. You now understand the vocabulary and the shape of contributing. You know what a fork, a clone, an issue, and a pull request are. You are no longer blocked by the process.",
                text_hi: "शानदार काम! अब आप योगदान की शब्दावली और प्रक्रिया समझ चुके हैं। आप जानते हैं कि fork, clone, issue और pull request क्या हैं। अब यह प्रक्रिया आपके रास्ते की रुकावट नहीं बनेगी।",
                text_od: "ଉତ୍କୃଷ୍ଟ କାର୍ଯ୍ୟ! ଆପଣ ଏବେ fork, clone, issue ଏବଂ pull request ବିଷୟରେ ସମ୍ପୂର୍ଣ୍ଣ ବୁଝିଗଲେ।",
            },
            {
                text: "But hear me clearly: the actual difficulty of fixing a specific, real issue is still ahead of you. This simulation removes the entry barrier, not the challenge itself. Real code takes patience.",
                text_hi: "लेकिन याद रखें: किसी असली समस्या को हल करने की चुनौती अभी आगे है। यह सिमुलेशन शुरुआती डर को मिटाता है, मेहनत को नहीं। असली कोड में समय और धैर्य लगता है।",
                text_od: "କିନ୍ତୁ ମନେ ରଖନ୍ତୁ: ପ୍ରକୃତ ସମସ୍ୟାର ସମାଧାନ କରିବା ଆଗକୁ ବାକି ଅଛି। ପ୍ରକୃତ କୋଡିଂ ଧୈର୍ଯ୍ୟ ମାଗେ।",
                choices: [
                    { label: "I understand.", label_hi: "मैं समझ गया।", label_od: "ମୁଁ ବୁଝିପାରିଲି।", next: 6 },
                    { label: "Give me the real issue.", label_hi: "मुझे असली issue दीजिए।", label_od: "ମୋତେ ପ୍ରକୃତ issue ଦିଅନ୍ତୁ।", next: 6 },
                ],
            },
            {
                text: "Then the gate is open. Your journey begins here with real open source. Go forth, traveler — the community awaits your first contribution!",
                text_hi: "तो फाटक खुला है। यहाँ से आपकी असली ओपन सोर्स यात्रा शुरू होती है। आगे बढ़ो, मुसाफ़िर — समुदाय तुम्हारे पहले योगदान का इंतज़ार कर रहा है!",
                text_od: "ଦ୍ୱାର ଉନ୍ମୁକ୍ତ! ଏଠାରୁ ଆପଣଙ୍କ ପ୍ରକୃତ ଯାତ୍ରା ଆରମ୍ଭ। ସମୁଦାୟ ଆପଣଙ୍କ ଅପେକ୍ଷାରେ ଅଛି!",
                questComplete: true,
            },
        ],
    },
};

export function getNodeText(node, lang = 'en') {
    if (lang === 'hi' && node.text_hi) return node.text_hi;
    if (lang === 'od' && node.text_od) return node.text_od;
    return node.text;
}

export function getChoiceLabel(choice, lang = 'en') {
    if (lang === 'hi' && choice.label_hi) return choice.label_hi;
    if (lang === 'od' && choice.label_od) return choice.label_od;
    return choice.label;
}

export function getLocalizedUI(lang = 'en') {
    const UI_TRANSLATIONS = {
        en: {
            continueBtn: 'Continue →',
            completeQuestBtn: 'Complete Quest 🌟',
            scanRepoBtn: 'Scan Repository 📡',
            openTerminalBtn: 'Open Terminal 💻',
            escLeave: 'Esc · leave',
            roles: {
                borin: 'the Forge-Keeper',
                elda: 'the Scribe',
                maren: 'the Cartographer',
                fenwick: 'the Courier',
                oren: 'the Watcher',
                voss: 'the Gatekeeper'
            }
        },
        hi: {
            continueBtn: 'आगे बढ़ें →',
            completeQuestBtn: 'क्वेस्ट पूरा करें 🌟',
            scanRepoBtn: 'रिपॉजिटरी स्कैन करें 📡',
            openTerminalBtn: 'टर्मिनल खोलें 💻',
            escLeave: 'Esc · बाहर निकलें',
            roles: {
                borin: 'द फ़ोर्ज-कीपर (लोहार)',
                elda: 'द स्क्राइब (लेखक)',
                maren: 'द कार्टोग्राफ़र (नक्शानवीस)',
                fenwick: 'द कूरियर (संदेशवाहक)',
                oren: 'द वॉचर (ऋषि)',
                voss: 'द गेटकीपर (द्वारपाल)'
            }
        },
        od: {
            continueBtn: 'ଆଗକୁ ବଢ଼ନ୍ତୁ →',
            completeQuestBtn: 'କ୍ୱେଷ୍ଟ୍ ପୂରଣ କରନ୍ତୁ 🌟',
            scanRepoBtn: 'ରିପୋଜିଟୋରୀ ସ୍କାନ୍ କରନ୍ତୁ 📡',
            openTerminalBtn: 'ଟର୍ମିନାଲ୍ ଖୋଲନ୍ତୁ 💻',
            escLeave: 'Esc · ବାହାରନ୍ତୁ',
            roles: {
                borin: 'ଦ ଫୋର୍ଜ-କିପର',
                elda: 'ଦ ସ୍କ୍ରାଇବ୍ (ଲେଖକ)',
                maren: 'ଦ କାର୍ଟୋଗ୍ରାଫର (ନକ୍ସାକାର)',
                fenwick: 'ଦ କୁରିଅର (ଦୂତ)',
                oren: 'ଦ ୱାଚର୍ (ଜ୍ଞାନୀ)',
                voss: 'ଦ ଗେଟକିପର (ଦ୍ୱାରପାଳ)'
            }
        }
    };
    return UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
}

/**
 * Process dialogue text: convert ~term~ markers into jargon chip HTML.
 * @param {string} text — raw dialogue text
 * @param {string} lang — 'en', 'hi', or 'od'
 * @returns {string} — HTML string
 */
export function processDialogueText(text, lang = 'en') {
    return text.replace(/~([^~]+)~/g, (match, term) => {
        // Find matching jargon key
        const key = term.toLowerCase().replace(/\s+/g, '-');
        const def = getJargonDefinition(key, lang);
        if (def.definition) {
            return `<span class="jargon-inline" data-term="${key}" title="${def.definition}">${term}</span>`;
        }
        return `<strong>${term}</strong>`;
    });
}
