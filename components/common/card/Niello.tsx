'use client';

import React from 'react';

interface NielloProps {
  heading?: string;
  number?: string;
  validThru?: string;
  date?: string;
  name?: string;
  code?: string;
}

const Niello: React.FC<NielloProps> = ({
  number = "4962 1162 7845 1269",
  date = "12/28",
  name = "Chenyme",
  code = "127"
}) => {
  return (
    <div className="bg-transparent w-60 h-[154px] [perspective:1000px] text-white">
      <div className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
        {/* 卡片正面 */}
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-[rgba(0,0,0,0.4)_0px_2px_2px,rgba(0,0,0,0.3)_0px_7px_13px_-3px,rgba(0,0,0,0.2)_0px_-1px_0px_inset] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(ellipse_at_top_right,rgba(200,200,200,0.1),transparent_60%)] before:z-0">
          {/* 姓名 */}
          <p className="absolute text-sm top-3 right-6 font-medium text-white [text-shadow:-0.2px_-0.2px_0.2px_white,0.2px_-0.2px_0.2px_gray,-0.2px_0.2px_0.2px_white,0.2px_0.2px_0.2px_gray]">
            {name}
          </p>
          
          {/* 芯片 */}
          <svg 
            className="absolute w-[30px] h-[30px] top-4 left-4" 
            xmlns="http://www.w3.org/2000/svg" 
            x="0px" 
            y="0px" 
            width="30px" 
            height="30px" 
            viewBox="0 0 50 50"
          >
            <image 
              width="50" 
              height="50" 
              x="0" 
              y="0" 
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="
            ></image>
          </svg>
          
          {/* 非接触式支付图标 */}
          <svg 
            className="absolute w-5 h-5 top-[60px] right-6" 
            xmlns="http://www.w3.org/2000/svg" 
            x="0px" 
            y="0px" 
            width="20px" 
            height="20px" 
            viewBox="0 0 50 50"
          >
            <image 
              width="50" 
              height="50" 
              x="0" 
              y="0" 
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQflGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/FfPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xNGQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49itVoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJkHpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15zbkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJqSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKBsSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71AmzZ+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+rzeKYmd3pNa6fuI75MiC0uXXSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUicUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaInKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBKxDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1NiswMDowMIXeN6gAAAAASUVORK5CYII="
            ></image>
          </svg>
          
          {/* 卡号 */}
          <p className="absolute text-sm top-[88px] left-4 tracking-[0.1em] text-white" style={{ fontFamily: 'Consolas, monospace' }}>
            {number}
          </p>
          
          {/* 有效期标签和日期 */}
          <div className="absolute top-[112px] left-4 text-white z-10">
            <p className="text-[7px] text-gray-300 leading-none mb-0.5">VALID THRU</p>
            <p className="text-[11px]" style={{ fontFamily: 'Consolas, monospace' }}>
              {date}
            </p>
          </div>
          
          {/* 卡片名称 */}
          <p className="absolute font-bold text-[10px] top-[120px] left-18 text-white tracking-wide uppercase z-10">
            Linux Do Metaverse
          </p>
          
          {/* 支付标志 (三角形三色圆圈) */}
          <svg 
            className="absolute bottom-4 right-4" 
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
        </div>

        {/* 卡片背面 */}
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-[rgba(0,0,0,0.4)_0px_2px_2px,rgba(0,0,0,0.3)_0px_7px_13px_-3px,rgba(0,0,0,0.2)_0px_-1px_0px_inset] [transform:rotateY(180deg)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,200,200,0.1),transparent_70%)] before:z-0">
          {/* 磁条 */}
          <div 
            className="absolute w-full h-6 top-[38px] left-0 z-10"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                #303030,
                #303030 10px,
                #202020 10px,
                #202020 20px
              )`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          ></div>
          
          {/* 签名栏 */}
          <div className="absolute bg-white w-32 h-[13px] top-20 left-[13px] rounded-[2.5px] z-10 shadow-sm bg-gradient-to-r from-white to-gray-50"></div>
          
          {/* CVV栏 */}
          <div className="absolute bg-white w-[65px] h-[13px] top-20 right-4 rounded-[2.5px] flex items-center justify-center z-10 shadow-sm bg-gradient-to-r from-gray-50 to-white">
            <p className="font-bold text-center text-black text-[10px] leading-none" style={{ fontFamily: 'Consolas, monospace' }}>
              {code}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Niello; 