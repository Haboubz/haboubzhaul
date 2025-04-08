import Image from 'next/image';
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div className="container">
      {/* Clickable Logo that redirects to Home */}
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="logo" />
      </Link>
      {children}
    </div>
  );
};

export default Layout;
