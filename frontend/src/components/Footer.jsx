const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-200/80 text-base-content p-4 mt-auto">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} — Developed By{" "}
          <span className="font-semibold">Ayush Behera</span>
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
