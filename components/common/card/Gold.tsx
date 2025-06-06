import React from 'react';

interface GoldCardProps {
  heading?: string;
  number?: string;
  date?: string;
  name?: string;
  code?: string;
}

const Gold: React.FC<GoldCardProps> = ({ 
  heading = "GOLD", 
  number = "4356 7891 2345 6789", 
  date = "09/26", 
  name = "LINUX DO METAVERSE", 
  code = "123" 
}) => {
  return (
    <div className="w-[240px] h-[154px] [perspective:1000px] text-white">
      <div className="relative w-full h-full text-center transition-transform duration-800 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
        {/* 正面 */}
        <div className="absolute flex flex-col justify-center w-full h-full [backface-visibility:hidden] rounded-2xl shadow-md bg-gradient-to-br from-[#edcb78] via-[#f7e4b2] to-[#fee08b] border border-[#d4af37]">
          <p className="absolute text-[0.95em] font-[550] top-3 right-6 text-[#9d8b4e] [text-shadow:-0.2px_-0.2px_0.2px_white,0.2px_-0.2px_0.2px_gray,-0.2px_0.2px_0.2px_white,0.2px_0.2px_0.2px_gray]">
            {heading}
          </p>
          
          {/* 三色圆圈标志 - 使用Niello中的SVG样式 */}
          <svg 
            className="absolute bottom-5 right-6" 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 32 32"
          >
            {/* 顶部黑色圆圈 */}
            <circle cx="16" cy="12" r="7" fill="#000000" fillOpacity="0.8" />
            {/* 左下白色圆圈 */}
            <circle cx="11" cy="20" r="7" fill="#ffffff" fillOpacity="0.9" />
            {/* 右下黄色圆圈 */}
            <circle cx="21" cy="20" r="7" fill="#fbbf24" fillOpacity="0.8" />
            {/* 中心重叠混合效果 */}
            <circle cx="16" cy="17" r="3" fill="none" stroke="#333333" strokeWidth="1" strokeOpacity="0.2" />
          </svg>
          
          {/* 芯片 */}
          <div className="absolute w-[30px] h-[30px] top-[3em] left-[1.5em]">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <image width="50" height="50" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YmODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==" />
            </svg>
          </div>
          
          {/* 持卡人姓名 */}
          <p className="absolute text-[11px] font-[550] top-[10.9em] left-[2.2em] text-[#9d8b4e]">
            {name}
          </p>
        </div>
        
        {/* 反面 */}
        <div className="absolute flex flex-col justify-center w-full h-full [backface-visibility:hidden] rounded-2xl shadow-md bg-gradient-to-br from-[#fee08b] via-[#f7e4b2] to-[#edcb78] [transform:rotateY(180deg)]">
          {/* 磁条 */}
          <div 
            className="absolute w-full h-[28px] top-[32px] left-0"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                #edcb71,
                #edcb71 10px,
                #d1b665 10px,
                #d1b665 20px
              )`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          ></div>
          
          {/* 非接触式支付标志 */}
          <div className="absolute top-[98px] right-[10px]">
            <svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <image width="30" height="30" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQflGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/FfPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xNGQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49itVoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJkHpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15zbkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJqSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKBsSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71AmzZ+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+rzeKYmd3pNa6fuI75MiC0uXXSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUicUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaInKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBKxDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1NiswMDowMIXeN6gAAAAASUVORK5CYII=" />
            </svg>
          </div>
          
          {/* 卡号 */}
          <p className="absolute text-[11px] font-semibold tracking-[1px] top-[80px] left-[16px] text-[#9d8b4e] font-['Consolas',monospace]">
            {number}
          </p>
          
          {/* 有效期和CVC的容器 */}
          <div className="absolute flex items-center justify-between w-[75%] top-[103px] left-[16px]">
            {/* 有效期 */}
            <div className="flex flex-col items-start">
              <p className="text-[7px] text-[#9d8b4e] mb-0.5">EXP</p>
              <p className="text-[11px] font-semibold text-[#9d8b4e] font-['Consolas',monospace]">
                {date}
              </p>
            </div>
            
            {/* CVC号码 */}
            <div className="flex flex-col items-start mr-22">
              <p className="text-[7px] text-[#9d8b4e] mb-0.5">CVC</p>
              <p className="text-[11px] font-semibold text-[#9d8b4e] font-['Consolas',monospace]">
                {code}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gold; 