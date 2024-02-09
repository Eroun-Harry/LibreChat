import { Link } from 'react-router-dom';

export default function AdminMenu() {
  const menuItems = [
    { name: '대시보드', url: 'dashboard' },
    { name: '사용자 관리', url: 'users' },
  ];

  return (
    <div className="text-token-text-primary flex flex-col gap-2 pb-2 text-sm">
      {menuItems.map((item, index) => (
        <div key={index}>
          <Link to={item.url}>
            <span className="group relative flex cursor-pointer items-center gap-3 break-all rounded-md px-3 py-3 hover:bg-gray-900 hover:pr-4">
              {item.name}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
