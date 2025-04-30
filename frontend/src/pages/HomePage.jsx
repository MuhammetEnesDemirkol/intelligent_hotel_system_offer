import React from "react";
import { Link } from "react-router-dom";
import "../styles/user.css";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* HERO BANNER */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Hoş Geldiniz!</h1>
          <p className="hero-subtitle">
            Lüksün ve konforun buluştuğu adres: Akıllı Otel
          </p>
          <Link to="/reservation" className="btn btn-primary hero-button">
            Hemen Rezervasyon Yap
          </Link>
        </div>
      </section>

      {/* HAKKIMIZDA */}
      <section className="about-section">
        <div className="container">
          <h2 className="about-title">Hakkımızda</h2>
          <p className="about-text">
            Akıllı Otel, konuklarına benzersiz bir konfor ve kalite deneyimi
            sunar. Modern odalarımız, özel hizmetlerimiz ve güler yüzlü
            personelimiz ile unutulmaz bir konaklama yaşayın.
          </p>
        </div>
      </section>

      {/* NEDEN BİZİ SEÇMELİSİNİZ */}
      <section className="features-section">
        <div className="container">
          <h2 className="about-title">Neden Bizi Seçmelisiniz?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <h4 className="feature-title">Modern Odalar</h4>
                <p className="feature-text">
                  Konforlu ve şık tasarlanmış odalarımızda kendinizi evinizde
                  hissedin.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <h4 className="feature-title">Uygun Fiyatlar</h4>
                <p className="feature-text">
                  Her bütçeye uygun fiyatlarımızla kaliteli hizmeti erişilebilir
                  kılıyoruz.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <h4 className="feature-title">Mükemmel Lokasyon</h4>
                <p className="feature-text">
                  Şehrin merkezinde, tüm önemli noktalara kolay erişim imkanı.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section text-center">
        <Link to="/rooms" className="btn cta-button">
          Odalarımıza Göz Atın
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
