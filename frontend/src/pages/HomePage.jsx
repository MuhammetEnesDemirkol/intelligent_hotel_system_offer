import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      {/* HERO BANNER */}
      <section className="bg-dark text-light text-center p-5 mb-4">
        <div className="container">
          <h1 className="display-4">Hoş Geldiniz!</h1>
          <p className="lead mt-3">
            Lüksün ve konforun buluştuğu adres: Akıllı Otel
          </p>
          <Link to="/reservation" className="btn btn-primary btn-lg mt-4">
            Hemen Rezervasyon Yap
          </Link>
        </div>
      </section>

      {/* HAKKIMIZDA */}
      <section className="container mb-5">
        <h2 className="text-center mb-4">Hakkımızda</h2>
        <p className="text-center">
          Akıllı Otel, konuklarına benzersiz bir konfor ve kalite deneyimi
          sunar. Modern odalarımız, özel hizmetlerimiz ve güler yüzlü
          personelimiz ile unutulmaz bir konaklama yaşayın.
        </p>
      </section>

      {/* NEDEN BİZİ SEÇMELİSİNİZ */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Neden Bizi Seçmelisiniz?</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <h4>Modern Odalar</h4>
              <p>
                Konforlu ve şık tasarlanmış odalarımızda kendinizi evinizde
                hissedin.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h4>Uygun Fiyatlar</h4>
              <p>
                Her bütçeye uygun fiyatlarımızla kaliteli hizmeti erişilebilir
                kılıyoruz.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h4>Mükemmel Lokasyon</h4>
              <p>
                Şehrin merkezinde, tüm önemli noktalara kolay erişim imkanı.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-5">
        <Link to="/rooms" className="btn btn-outline-primary btn-lg">
          Odalarımıza Göz Atın
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
