export function SignOutControl() {
  return (
    <form action="/auth/signout" method="post">
      <button className="ghostButton" type="submit">
        Sair da conta
      </button>
    </form>
  );
}
