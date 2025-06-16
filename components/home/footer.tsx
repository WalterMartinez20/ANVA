import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Info,
  FileText,
  Lock,
  Cookie,
  HelpCircle,
} from "lucide-react";

export default function Footer() {
  return (
    // Footer con información de contacto
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Carteras Artesanales</h3>
            <p className="text-gray-400">
              ✨ Carteras y accesorios hechos a mano.
              <br />
              🎀 Exclusivos, personalizados y llenos de estilo.
              <br />
              🌸 Para mujeres que valoran lo autentico.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/share/18Grb5voXJ/?mibextid=wwXIfr"
                className="group bg-white/10 hover:bg-[#1877F2] p-2 rounded-full transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5 text-white group-hover:scale-110 transform transition-transform duration-200" />
              </a>
              <a
                href="https://www.instagram.com/anva.sv/?igsh=NjltdGZqNDdva2Vo#"
                className="group bg-white/10 hover:bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-2 rounded-full transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5 text-white group-hover:scale-110 transform transition-transform duration-200" />
              </a>
              <a
                href="https://wa.me/1234567890"
                className="group bg-white/10 hover:bg-[#25D366] p-2 rounded-full transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-5 w-5 text-white group-hover:scale-110 transform transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.004 0C5.375 0 0 5.373 0 12.002c0 2.122.552 4.201 1.603 6.042L0 24l6.075-1.59a11.967 11.967 0 005.929 1.515h.002C18.63 23.925 24 18.553 24 12.002 24 5.373 18.633 0 12.004 0zm.005 21.738a9.71 9.71 0 01-4.946-1.37l-.356-.212-3.54.926.944-3.465-.236-.366A9.738 9.738 0 012.26 12C2.26 6.496 6.5 2.26 12.01 2.26c2.674 0 5.184 1.041 7.07 2.928a9.93 9.93 0 012.928 7.067c0 5.505-4.238 9.743-9.743 9.743zm5.737-7.12c-.31-.156-1.832-.91-2.116-1.015-.284-.105-.486-.156-.688.155-.203.31-.82 1.015-1.005 1.222-.185.207-.362.233-.673.078-.31-.155-1.31-.483-2.493-1.537-.922-.823-1.546-1.84-1.73-2.153-.185-.31-.02-.479.14-.635.145-.145.316-.362.474-.542.158-.18.21-.31.316-.516.105-.207.053-.39-.026-.546-.08-.156-.705-1.693-.967-2.317-.255-.606-.513-.525-.704-.535l-.6-.011a1.174 1.174 0 00-.862.403 3.614 3.614 0 00-1.137 2.693c0 1.588 1.149 3.125 1.312 3.34.157.207 2.27 3.48 5.507 4.888.77.333 1.37.53 1.84.678.774.248 1.478.213 2.033.13.62-.093 1.882-.768 2.147-1.511.265-.744.265-1.382.186-1.512-.08-.13-.29-.213-.606-.37z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Políticas</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <Link
                  href="/politicas"
                  className="text-gray-400 hover:text-white"
                >
                  Todas las Politicas
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <Link
                  href="/politicas/privacidad"
                  className="text-gray-400 hover:text-white"
                >
                  Politicas de Privacidad
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Cookie className="w-4 h-4 text-gray-400" />
                <Link
                  href="/politicas/cookies"
                  className="text-gray-400 hover:text-white"
                >
                  Politicas de Cookies
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <Link
                  href="/politicas/cookies"
                  className="text-gray-400 hover:text-white"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400" />
                <Link
                  href="/sobre-nosotros"
                  className="text-gray-400 hover:text-white"
                >
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Puerto El Triunfo, Puerto El Triunfo, El Salvador</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+503 7865 9463</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>anvahechoamano@gmail.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Horario</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Lunes a Viernes: 9:00 - 18:00</li>
              <li>Sábados: 10:00 - 14:00</li>
              <li>Domingos: Cerrado</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} ANVA - Carteras Artesanales. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
