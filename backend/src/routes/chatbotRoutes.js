const express = require("express");
const router = express.Router();



router.get("/answers", (req, res) => {
  res.json([
    {
      keywords: ["oda fiyat", "fiyatlar", "ücret", "gecelik fiyat", "odalar ne kadar", "fiyat bilgisi"],
      answer: "Oda fiyatlarımız sezon, oda tipi ve doluluğa göre değişmektedir. En güncel fiyatlar için lütfen rezervasyon sayfamızı ziyaret edin veya bize ulaşın."
    },
    {
      keywords: ["rezervasyon iptal", "iptal", "rezervasyonumu iptal", "iptal politikası", "rezervasyonumu nasıl iptal edebilirim", "iptal ücreti"],
      answer: "Rezervasyonunuzu giriş tarihinden 24 saat öncesine kadar ücretsiz iptal edebilirsiniz. Daha geç yapılan iptallerde bir gecelik ücret alınır."
    },
    {
      keywords: ["çocuk", "bebek", "çocuk politikası", "çocuk ücreti", "çocuklar için ücret", "çocuk kabul"],
      answer: "0-6 yaş arası çocuklar ücretsizdir. 7 yaş ve üzeri çocuklar için ek ücret alınır. Bebek yatağı ücretsizdir."
    },
    {
      keywords: ["evcil hayvan", "pet", "hayvan kabul", "köpek", "kedi", "evcil hayvan getirebilir miyim"],
      answer: "Evcil hayvan kabul edilmektedir. Lütfen rezervasyon sırasında belirtiniz. Evcil hayvanlar için ek temizlik ücreti alınabilir."
    },
    {
      keywords: ["transfer", "havaalanı", "servis", "shuttle", "havaalanı servisi var mı", "transfer hizmeti"],
      answer: "Havaalanı transfer hizmetimiz mevcuttur. Detaylı bilgi ve rezervasyon için resepsiyon ile iletişime geçebilirsiniz."
    },
    {
      keywords: ["özel istek", "doğum günü", "süsleme", "balayı", "sürpriz", "özel kutlama"],
      answer: "Özel isteklerinizi rezervasyon sırasında veya girişten önce bize iletebilirsiniz. Doğum günü, balayı ve diğer sürprizler için yardımcı olabiliriz."
    },
    {
      keywords: ["ödeme", "kredi kartı", "nakit", "ödeme şekli", "ödeme yöntemleri", "ödeme nasıl yapılır", "ödeme seçenekleri"],
      answer: "Otelimizde nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz. Online ödeme de mümkündür."
    },
    {
      keywords: ["check-in", "giriş saati", "giriş zamanı", "ne zaman giriş yapabilirim"],
      answer: "Check-in saatimiz 14:00'ten itibaren başlamaktadır. Odanız hazırsa daha erken giriş yapabilirsiniz."
    },
    {
      keywords: ["check-out", "çıkış saati", "çıkış zamanı", "en geç ne zaman çıkış yapabilirim"],
      answer: "Check-out saatimiz 12:00'dir. Geç çıkış talepleriniz için resepsiyon ile görüşebilirsiniz."
    },
    {
      keywords: ["wifi", "wi-fi", "internet", "kablosuz internet", "odada internet var mı"],
      answer: "Otelimizin tüm alanlarında ve odalarda ücretsiz yüksek hızlı Wi-Fi hizmeti sunulmaktadır."
    },
    {
      keywords: ["otopark", "park yeri", "araç parkı", "araba parkı", "otopark var mı"],
      answer: "Otelimizde ücretsiz ve güvenli otopark hizmeti bulunmaktadır. Rezervasyon gerektirmez."
    },
    {
      keywords: ["spa", "masaj", "hamam", "sauna", "spa hizmetleri", "spa rezervasyon"],
      answer: "Spa merkezimiz 09:00-21:00 saatleri arasında hizmet vermektedir. Masaj ve diğer hizmetler için önceden rezervasyon yaptırabilirsiniz."
    },
    {
      keywords: ["restoran", "yemek", "kahvaltı", "akşam yemeği", "menü", "restoran saatleri", "yemek servisi"],
      answer: "Restoranımız 07:00-23:00 saatleri arasında hizmet vermektedir. Kahvaltı 07:00-10:00 arası ücretsizdir. Akşam yemeği için rezervasyon önerilir."
    },
    {
      keywords: ["havuz", "yüzme", "havuz saati", "havuz açık mı", "havuz var mı"],
      answer: "Açık ve kapalı yüzme havuzlarımız 08:00-22:00 saatleri arasında hizmet vermektedir."
    },
    {
      keywords: ["temizlik", "oda temizliği", "havlu", "çarşaf", "temizlik hizmeti", "temizlik ne zaman"],
      answer: "Oda temizliği her gün yapılmaktadır. Ekstra havlu veya çarşaf için resepsiyona başvurabilirsiniz."
    },
    {
      keywords: ["sigara", "sigara içmek", "sigara odası", "sigara alanı", "sigara içilebilir mi"],
      answer: "Otelimizde sigara içilmeyen odalar mevcuttur. Sigara içmek için belirlenmiş alanları kullanabilirsiniz."
    },
    {
      keywords: ["sigara cezası", "odada sigara içilirse ne olur"],
      answer: "Sigara içilmeyen odalarda sigara içilmesi durumunda ekstra temizlik ücreti yansıtılabilir."
    },
    {
      keywords: ["engelli", "erişim", "engelli odası", "tekerlekli sandalye", "engelli misafir", "engelli rampası"],
      answer: "Otelimizde engelli misafirlerimiz için erişilebilir odalar, rampalar ve asansörler bulunmaktadır."
    },
    {
      keywords: ["kampanya", "indirim", "özel teklif", "fırsat", "kampanyalarınız var mı"],
      answer: "Güncel kampanya ve fırsatlarımız için web sitemizi veya sosyal medya hesaplarımızı takip edebilirsiniz."
    },
    {
      keywords: ["toplantı salonu", "konferans", "etkinlik", "organizasyon", "toplantı odası", "salon kiralama"],
      answer: "Otelimizde farklı kapasitelerde toplantı ve etkinlik salonları bulunmaktadır. Detaylı bilgi ve rezervasyon için lütfen bizimle iletişime geçin."
    },
    {
      keywords: ["ulaşım", "şehir merkezi", "merkeze uzaklık", "taksi", "otobüs", "otelden merkeze ulaşım"],
      answer: "Otelimiz şehir merkezine 2 km uzaklıktadır. Taksi ve toplu taşıma ile kolayca ulaşabilirsiniz. Dilerseniz resepsiyondan taksi çağırabilirsiniz."
    },
    {
      keywords: ["klima", "ısıtma", "soğutma", "odada klima var mı"],
      answer: "Tüm odalarımızda klima ve merkezi ısıtma sistemi bulunmaktadır."
    },
    {
      keywords: ["mini bar", "minibar", "odada minibar var mı"],
      answer: "Tüm odalarımızda minibar bulunmaktadır."
    },
    {
      keywords: ["rezervasyon nasıl yapılır", "rezervasyon yapmak istiyorum", "online rezervasyon"],
      answer: "Web sitemizden veya telefonla kolayca rezervasyon yapabilirsiniz. Yardım için bize ulaşabilirsiniz."
    },
    {
      keywords: ["geç çıkış", "late check-out", "geç çıkış ücreti"],
      answer: "Geç çıkış talepleriniz için resepsiyon ile görüşebilirsiniz. Müsaitlik durumuna göre ek ücret alınabilir."
    },
    {
      keywords: ["erken giriş", "early check-in", "erken giriş ücreti"],
      answer: "Erken giriş talepleriniz için resepsiyon ile görüşebilirsiniz. Odanız müsaitse yardımcı olunur."
    },
    {
      keywords: ["çamaşır", "çamaşırhane", "ütü", "kıyafet yıkama", "çamaşır yıkama"],
      answer: "Otelimizde ücretli çamaşırhane ve ütü hizmeti sunulmaktadır. Detaylar için resepsiyon ile iletişime geçebilirsiniz."
    },
    {
      keywords: ["ingilizce konuşuluyor mu", "personel hangi dili konuşuyor", "dil desteği"],
      answer: "Otel personelimiz Türkçe ve İngilizce başta olmak üzere birkaç dilde hizmet vermektedir."
    },
    {
      keywords: ["vegan yemek", "glutensiz", "helal yemek", "özel diyet", "vejetaryen"],
      answer: "Restoranımızda vejetaryen, vegan ve glutensiz yemek seçenekleri mevcuttur. Lütfen özel diyet taleplerinizi önceden belirtiniz."
    },
    {
      keywords: ["priz", "elektrik", "adaptör", "şarj", "elektrik tipi"],
      answer: "Otelimizde standart Avrupa tipi (Type C) prizler kullanılmaktadır. Adaptör ihtiyacınız varsa resepsiyondan temin edebilirsiniz."
    },
    {
      keywords: ["şebeke", "telefon çekiyor mu", "mobil internet", "sinyal var mı"],
      answer: "Otelimizde tüm mobil operatörler için güçlü sinyal mevcuttur. Ayrıca ücretsiz Wi-Fi hizmetimiz de bulunmaktadır."
    },
    {
      keywords: ["valiz bırakmak", "bagaj emanet", "check-out sonrası valiz", "bavul bırakma"],
      answer: "Check-in öncesi veya check-out sonrası valizlerinizi ücretsiz olarak resepsiyona emanet edebilirsiniz."
    }
  ]);
});

module.exports = router;
