import React from "react";
import {
  Egg,
  Coffee,
  Truck,
  Users,
  BarChart,
  ArrowRight,
  Star,
  Facebook,
  Globe,
} from "lucide-react";
import "../assets/css/App.css";
import Navabar from "../components/Navabar";

export const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navabar />

      <section className="relative bg-white overflow-hidden pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Gestion intelligente</span>
              <span className="block text-green-600">des déchets café</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Optimisez la collecte et le recyclage des déchets de café avec
              notre plateforme complète. Simplifiez la gestion des collectes,
              suivez les performances et contribuez à un avenir plus vert.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/login"
                className="inline-block px-8 py-3 rounded-md text-white bg-green-600 hover:bg-green-700 font-medium"
              >
                Commencer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">500+</div>
            <div className="text-gray-500 mt-2">Collectes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">150+</div>
            <div className="text-gray-500 mt-2">Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">10+</div>
            <div className="text-gray-500 mt-2">Véhicules</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">95%</div>
            <div className="text-gray-500 mt-2">Taux de satisfaction</div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Témoignages</h2>
          <p className="text-center text-gray-500 mb-8">
            Découvrez l'expérience de nos clients avec le service CoCal.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gray-50 rounded-lg shadow p-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
              <div className="flex items-center mb-2">
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
              </div>
              <p className="text-gray-700 text-center mb-2">
                "La plateforme CoCal a révolutionné notre gestion des déchets
                organiques. Simple, efficace et très intuitive !"
              </p>
              <div className="font-semibold text-green-700">Josh Dupont</div>
              <div className="text-sm text-gray-400">
                Responsable d'établissement
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
              <div className="flex items-center mb-2">
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
              </div>
              <p className="text-gray-700 text-center mb-2">
                "Un service client réactif et des collectes toujours à l'heure.
                Je recommande vivement !"
              </p>
              <div className="font-semibold text-green-700">Marie Durant</div>
              <div className="text-sm text-gray-400">Gérante de café</div>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
              <div className="flex items-center mb-2">
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 w-5 h-5" />
              </div>
              <p className="text-gray-700 text-center mb-2">
                "La solution de CoCal s'intègre parfaitement à notre
                organisation. Les rapports sont clairs et utiles."
              </p>
              <div className="font-semibold text-green-700">Pierre Martin</div>
              <div className="text-sm text-gray-400">Directeur logistique</div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold mb-4">Notre mission</h3>
            <p className="text-gray-600 mb-4">
              Chez CoCal, nous facilitons la valorisation des déchets organiques
              afin de préserver l'environnement et d'optimiser la gestion des
              ressources. Notre mission est d'accompagner les établissements
              dans leur transition écologique grâce à des outils innovants et un
              accompagnement personnalisé.
            </p>
            <a
              href="/login"
              className="inline-block px-8 py-3 rounded-md text-white bg-green-600 hover:bg-green-700 font-medium"
            >
              Commencer
            </a>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-80 h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl">
              [Image / Slider]
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Prêt à rejoindre la révolution verte ?
          </h2>
          <p className="text-gray-300 mb-6">
            Commencez dès aujourd'hui la valorisation de vos déchets organiques
            avec <span className="text-green-400 font-semibold">CoCal</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/login"
              className="inline-block px-8 py-3 rounded-md text-green-700 bg-white font-medium hover:bg-green-50"
            >
              Connexion entreprise
            </a>
            <a
              href="#contact"
              className="inline-block px-8 py-3 rounded-md text-white bg-green-600 font-medium hover:bg-green-700"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Parlons de vos besoins</h3>
            <p className="text-gray-600 mb-6">
              Notre équipe est à votre disposition pour répondre à toutes vos
              questions et vous accompagner dans votre démarche de valorisation
              des déchets organiques.
            </p>
            <div className="mb-2">
              <span className="block font-semibold text-gray-700">
                Adresse :
              </span>
              <span className="text-gray-500">
                Immeuble Elhana, en face de la station de louage Ksour Essef,
                Mahdia, Tunisie
              </span>
            </div>
            <div className="mb-2">
              <span className="block font-semibold text-gray-700">
                Téléphone :
              </span>
              <span className="text-gray-500">
                {" "}
                +21698168360 / +21694170360
              </span>
            </div>
            <div className="mb-2">
              <span className="block font-semibold text-gray-700">Email :</span>
              <span className="text-gray-500">Administration@run-it.tn</span>
            </div>
            <div className="mt-6 text-gray-400 text-sm">
              Lundi - Vendredi : 09h - 18h
            </div>
          </div>
          <form className="bg-gray-50 rounded-lg shadow p-8 space-y-4">
            <h4 className="text-lg font-semibold mb-2">
              Demande d'information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom*"
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                placeholder="Établissement*"
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="email"
                placeholder="Email*"
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 md:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Téléphone"
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 md:col-span-2"
              />
            </div>
            <textarea
              placeholder="Votre message..."
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-green-500"
              rows={4}
            ></textarea>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rgpd"
                className="border-gray-300"
                required
              />
              <label htmlFor="rgpd" className="text-gray-600 text-sm">
                J'accepte la politique de confidentialité et le traitement de
                mes données.
              </label>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
            >
              Envoyer ma demande
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 grid md:grid-cols-4 gap-8 text-sm text-gray-500">
          <div>
            <div className="flex items-center mb-2">
              <Egg className="h-6 w-6 text-green-600" />
              <Coffee className="h-6 w-6 text-amber-600 ml-1" />
              <span className="ml-2 font-bold text-gray-800">CoCal</span>
            </div>
            <div className="mt-2">&copy; 2025 CoCal. Tous droits réservés.</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-2">Contact</div>
            <div>Administration@run-it.tn</div>
            <div> +21698168360 / +21694170360</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-2">Entreprise</div>
            <div>À propos</div>
            <div>Carrières</div>
            <div>Blog</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-2">Liens</div>
            <div>Politique de confidentialité</div>
            <div>Conditions d'utilisation</div>
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/profile.php?id=100094844006772" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600">
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
              <a href="https://www.run-it.tn/index.html" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
