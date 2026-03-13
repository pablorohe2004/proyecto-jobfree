function Registro() {
  return (
    <div>
      <h2>Crear cuenta</h2>

      <form>
        <input type="text" placeholder="Nombre" /><br /><br />
        <input type="email" placeholder="Email" /><br /><br />
        <input type="tel" placeholder="Teléfono" /><br /><br />
        <input type="password" placeholder="Contraseña" /><br /><br />

        <button>Crear cuenta</button>
      </form>
    </div>
  );
}

export default Registro;
