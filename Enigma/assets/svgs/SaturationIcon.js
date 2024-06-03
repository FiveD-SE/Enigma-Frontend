import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SaturationIcon = (props) => {
    return (
        <Svg
            fill="#000"
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 20 20"
            xmlSpace="preserve"
            {...props}
        >
            <Path d="M10 20C4.5 20 0 15.5 0 10S4.5 0 10 0s10 4.5 10 10-4.5 10-10 10zm0-18c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />
            <Path d="M10 4v12c3.3 0 6-2.7 6-6s-2.7-6-6-6z" />
        </Svg>
    )
}

export default SaturationIcon
