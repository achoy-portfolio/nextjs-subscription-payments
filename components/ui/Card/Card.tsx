import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-black">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-bold text-green-700">{title}</h3>{' '}
        {/* Added font-bold */}
        <p className="text-gray-600">{description}</p>
        <div className="text-blue-500">{children}</div>
      </div>
      {footer && (
        <div className="p-4 border-t rounded-b-md border-black bg-gray-900 text-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}
