import * as React from "react"
import Svg, { Path } from "react-native-svg"

const TemperatureIcon = (props) => {
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
                d="M15 4h5m-5 4h5m-3 4h3M8 16a1 1 0 100 2 1 1 0 000-2zm0 0V9m0 8l.007.007M12 17a4 4 0 11-7-2.646V6a3 3 0 016 0v8.354c.622.705 1 1.631 1 2.646z"
                stroke="#000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default TemperatureIcon;
