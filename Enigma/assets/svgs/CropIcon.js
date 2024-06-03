import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CropIcon(props) {
    return (
        <Svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M6 3v11.8c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C7.52 18 8.08 18 9.2 18H15m6 0h-3m0 3V9.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C16.48 6 15.92 6 14.8 6H9M3 6h3m1 11L21 3"
                stroke="#000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default CropIcon
