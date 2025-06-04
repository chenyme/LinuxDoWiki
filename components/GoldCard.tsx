interface GoldCardProps {
  heading?: string
  number?: string
  date?: string
  name?: string
  code?: string
}

const GoldCard = ({ 
  heading = 'LINUX DO', 
  number = '1234 5678 9012 3456', 
  date = '12/25', 
  name = 'LINUX DO METAVERSE', 
  code = '123' 
}: GoldCardProps) => {
  return (
    <div 
      className="w-60 h-40 text-white bg-transparent cursor-pointer group"
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative w-full h-full text-center transition-transform duration-700 group-hover:transform"
        style={{ 
          transformStyle: 'preserve-3d'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotateY(180deg)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotateY(0deg)'
        }}
      >
        {/* 正面 */}
        <div 
          className="absolute w-full h-full flex flex-col justify-center rounded-2xl shadow-lg bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 border border-yellow-400"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* 标题 */}
          <p 
            className="absolute top-3 right-6 text-yellow-700 text-sm font-medium"
            style={{ 
              textShadow: '-0.2px -0.2px 0.2px white, 0.2px -0.2px 0.2px gray, -0.2px 0.2px 0.2px white, 0.2px 0.2px 0.2px gray'
            }}
          >
            {heading}
          </p>
          
          {/* Logo - 双圆环 */}
          <svg 
            className="absolute bottom-3 right-3" 
            xmlns="http://www.w3.org/2000/svg" 
            width="36" 
            height="36" 
            viewBox="0 0 48 48"
          >
            <path fill="#e0e0e0" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
            <path fill="#c0c0c0" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
            <path fill="#d0d0d0" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
          </svg>
          
          {/* 芯片 */}
          <div className="absolute top-12 left-6 w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm border border-yellow-500"></div>
          
          {/* 名称 */}
          <p className="absolute bottom-6 left-9 text-yellow-700 text-xs font-medium tracking-wider">
            {name}
          </p>
        </div>

        {/* 背面 */}
        <div 
          className="absolute w-full h-full flex flex-col justify-center rounded-2xl shadow-lg bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* 磁条 */}
          <div 
            className="absolute top-8 left-0 w-full h-9"
            style={{
              background: 'repeating-linear-gradient(45deg, #edcb71, #edcb71 10px, #d1b665 10px, #d1b665 20px)'
            }}
          ></div>
          
          {/* 非接触式支付图标 */}
          <div className="absolute top-20 right-1">
            <svg 
              width="30" 
              height="30" 
              viewBox="0 0 24 24"
              fill="none"
            >
              <path 
                d="M5 9C5 7.89543 5.89543 7 7 7C8.10457 7 9 7.89543 9 9V15C9 16.1046 8.10457 17 7 17C5.89543 17 5 16.1046 5 15V9Z" 
                fill="#9d8b4e"
              />
              <path 
                d="M9 9C9 7.89543 9.89543 7 11 7C12.1046 7 13 7.89543 13 9V15C13 16.1046 12.1046 17 11 17C9.89543 17 9 16.1046 9 15V9Z" 
                fill="#9d8b4e"
              />
              <path 
                d="M13 9C13 7.89543 13.8954 7 15 7C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17C13.8954 17 13 16.1046 13 15V9Z" 
                fill="#9d8b4e"
              />
            </svg>
          </div>
          
          {/* 卡号 */}
          <p 
            className="absolute bottom-16 left-12 text-yellow-700 text-xs font-semibold tracking-widest"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            {number}
          </p>
          
          {/* 日期 */}
          <p 
            className="absolute bottom-9 left-12 text-yellow-700 text-xs font-semibold tracking-wide"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            {date}
          </p>
          
          {/* EXP 标签 */}
          <p 
            className="absolute bottom-6 left-12 text-yellow-700 text-xs font-semibold"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            EXP
          </p>
          
          {/* CVC */}
          <p 
            className="absolute bottom-9 left-40 text-yellow-700 text-xs font-semibold tracking-wide"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            {code}
          </p>
          
          {/* CVC 标签 */}
          <p 
            className="absolute bottom-6 right-6 text-yellow-700 text-xs font-semibold"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            CVC
          </p>
        </div>
      </div>
    </div>
  )
}

export default GoldCard