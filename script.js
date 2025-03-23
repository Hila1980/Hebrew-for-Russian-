// פונקציה להשמעת קול באמצעות Web Speech API
function playSound(soundId) {
    // הדגשת הכרטיס 
    const cardElement = document.querySelector(`[onclick="playSound('${soundId}')"]`);
    if (cardElement) {
        cardElement.classList.add('active-sound');
        setTimeout(() => {
            cardElement.classList.remove('active-sound');
        }, 1000);
    }
    
    // אם Web Speech API לא זמין
    if (!('speechSynthesis' in window)) {
        console.error("הדפדפן שלך אינו תומך בהקראה.");
        alert("הדפדפן שלך אינו תומך בהקראה.");
        return;
    }
    
    // מיפוי זיהוי לטקסט שיוקרא
    const textMap = {
        // אותיות
        'alef': 'אָלֶף',
        'bet': 'בֵּית',
        'gimel': 'גִימֶל',
        'dalet': 'דָּלֶת',
        'hey': 'הֵא',
        'vav': 'וָו',
        'zayin': 'זַיִן',
        'het': 'חֵית',
        'tet': 'טֵית',
        'yod': 'יוֹד',
        'kaf': 'כַּף',
        'lamed': 'לָמֶד',
        'mem': 'מֵם',
        'nun': 'נוּן',
        'samekh': 'סָמֶךְ',
        'ayin': 'עַיִן',
        'pe': 'פֵּה',
        'tsadi': 'צָדִי',
        'qof': 'קוֹף',
        'resh': 'רֵישׁ',
        'shin': 'שִׁין',
        'tav': 'תָּו',
        // מילים
        'word-apple': 'תַּפּוּחַ',
        'word-boy': 'יֶלֶד',
        'word-house': 'בַּיִת',
        'word-chair': 'כִּיסֵּא',
        'word-table': 'שֻׁלְחָן',
        'word-book': 'סֵפֶר',
        // משפטים
        'sentence-hello': 'שָׁלוֹם',
        'sentence-how-are-you': 'מַה שְׁלוֹמְךָ?',
        'sentence-how-are-you-f': 'מַה שְׁלוֹמֵךְ?',
        'sentence-thanks': 'תּוֹדָה'
    };
    
    // הטקסט להקראה
    const textToSpeak = textMap[soundId] || soundId;
    
    try {
        // יצירת אובייקט הקראה חדש
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // בדיקה אם קיימים קולות בעברית
        const voices = window.speechSynthesis.getVoices();
        const hebrewVoice = voices.find(voice => voice.lang.includes('he') || voice.lang.includes('iw'));
        
        // הגדרת שפה לעברית
        utterance.lang = 'he-IL';
        
        // אם נמצא קול עברי, השתמש בו
        if (hebrewVoice) {
            utterance.voice = hebrewVoice;
        }
        
        // הגדרת מהירות ועוצמה
        utterance.rate = 0.9; // קצת יותר איטי מהרגיל
        utterance.volume = 1.0; // עוצמת קול מרבית
        
        // טיפול במצב שבו הקולות לא נטענו עדיין
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = function() {
                const updatedVoices = window.speechSynthesis.getVoices();
                const updatedHebrewVoice = updatedVoices.find(voice => voice.lang.includes('he') || voice.lang.includes('iw'));
                if (updatedHebrewVoice) {
                    utterance.voice = updatedHebrewVoice;
                }
                window.speechSynthesis.speak(utterance);
            };
        } else {
            // הפעלת ההקראה
            window.speechSynthesis.speak(utterance);
        }
        
        console.log('הקראה של:', textToSpeak);
    } catch (error) {
        console.error('שגיאה בהקראה:', error);
        alert('שגיאה בהקראה. נא לנסות שוב מאוחר יותר.');
    }
}

// פונקציה לניווט בין הלשוניות
function openTab(tabName) {
    // מסיר את המחלקה 'active' מכל הלשוניות
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // מוסיף את המחלקה 'active' ללשונית הנבחרת
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // טעינת התוכן המתאים
    fetch(`${tabName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('content-container').innerHTML = data;
        })
        .catch(error => {
            console.error('שגיאה בטעינת הדף:', error);
            document.getElementById('content-container').innerHTML = '<p>שגיאה בטעינת התוכן. נא לנסות שוב מאוחר יותר.</p>';
        });
}

// טעינת לשונית ברירת המחדל כאשר הדף נטען
document.addEventListener('DOMContentLoaded', function() {
    openTab('alphabet');
});
