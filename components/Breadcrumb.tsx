import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="breadcrumb-section">
      <div className="container">
        <ul className="breadcrumb">
          <li>
            <Link href="/">Trang chủ</Link>
          </li>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <li className="separator">/</li>
              <li>
                {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};
