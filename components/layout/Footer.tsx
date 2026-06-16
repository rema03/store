export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-black tracking-tighter mb-4">FASHION MALL</h2>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              우리는 가장 트렌디하고 감각적인 패션을 제안합니다. 당신의 스타일을 완성하는 단 하나의 쇼핑몰.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4">CS Center</h3>
            <p className="text-sm text-gray-500">1234-5678</p>
            <p className="text-xs text-gray-400 mt-1">10:00 - 18:00 (Weekend Off)</p>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Notice</li>
              <li>Shipping</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2024 Fashion Mall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
