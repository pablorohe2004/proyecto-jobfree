import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Login() {
  return (
    // Contenedor que centra el login en la pantalla
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      {/* Tarjeta del login */}
      <div className="bg-gray-100 text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="JobFree" className="h-24" />
        </div>

        {/* Separador */}
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-400/30" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Accede a tu cuenta
        </h2>

        {/* Formulario de login */}
        <form>

          {/* Input email */}
          <input
            id="email"
            className="w-full bg-transparent border my-3 border-gray-400 outline-none rounded-full py-2.5 px-4"
            type="email"
            placeholder="jobfree@gmail.com"
            required />

          {/* Input contraseña */}
          <input
            id="password"
            className="w-full bg-transparent border mt-1 border-gray-400 outline-none rounded-full py-2.5 px-4"
            type="password"
            placeholder="Contraseña"
            required />

          {/* Recordar usuario */}
          <div className="flex items-center gap-2 py-2">
            <input type="checkbox" />
            <span>Recordar datos</span>
          </div>

          {/* Botón entrar */}
          <button type="submit" className="w-full mb-3 bg-blue-600 py-2.5 rounded-full text-white">
            Entrar
          </button>

        </form>

        {/* Recuperar contraseña */}
        <div className="text-center text-sm">
          <Link to="/forgot-password" className="text-blue-600">
            ¿Has olvidado tu contraseña?
          </Link>
        </div>

        {/* Ir a registro */}
        <p className="text-center mt-2">
          ¿No estás registrado?{" "}
          <Link to="/registro" className="text-blue-600">
            Date de alta
          </Link>
        </p>

        {/* Separador */}
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-400/30" />
          <span>o</span>
          <hr className="flex-1 border-gray-400/30" />
        </div>

        {/* Login Google */}
        <button type="button" className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800">
          <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="google" />
          Iniciar sesión con Google
        </button>

        {/* Login Microsoft */}
        <button className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800" >
          <img src="https://img.icons8.com/color/48/microsoft.png" className="h-5" alt="microsoft" />
          Iniciar sesión con Microsoft Account
        </button>

        {/* Login Apple */}
        <button type="button" className="w-full flex items-center gap-2 justify-center mt-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800" >
          <img className="h-4 w-4" src="https://img.icons8.com/ios-filled/50/mac-os.png" alt="apple" />
          Iniciar sesión con Apple
        </button>

      </div>

    </div>
  );
}

export default Login;
