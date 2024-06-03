import * as React from "react"
import Svg, { Path } from "react-native-svg"

const BrightnessIcon = (props) => {
    return (
        <Svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path d="M17 12a5 5 0 10-5 5 5.006 5.006 0 005-5zm-5 3a3 3 0 113-3 3 3 0 01-3 3zM11 4V2a1 1 0 012 0v2a1 1 0 01-2 0zm1 15a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zm7.778-13.364L18.364 7.05a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 1.414zM4.222 18.364l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414a1 1 0 01-1.414-1.414zM23 12a1 1 0 01-1 1h-2a1 1 0 010-2h2a1 1 0 011 1zM2 13a1 1 0 010-2h2a1 1 0 010 2zm14.95 5.364a1 1 0 011.414-1.414l1.414 1.414a1 1 0 11-1.414 1.414zM4.222 5.636a1 1 0 011.414-1.414L7.05 5.636A1 1 0 115.636 7.05z" />
        </Svg>
    )
}

export default BrightnessIcon
