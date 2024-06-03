import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ExposureIcon = (props) => {
    return (
        <Svg
            fill="#000"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 34.628 34.628"
            xmlSpace="preserve"
            {...props}
        >
            <Path d="M33.851 3.815H.776c-.428 0-.776.268-.776.604V30.21c0 .33.348.604.776.604H33.85c.428 0 .778-.273.778-.604V4.419c.001-.336-.35-.604-.777-.604zM3.17 10.198h3.424V6.84h2.943v3.357h3.38v2.939h-3.38v3.451H6.594v-3.45H3.17v-2.939zm28.482 16.847c0 .256-.288.469-.641.469H3.855c-.352 0-.64-.213-.64-.469L31.012 6.508c.353 0 .641.207.641.469l-.001 20.068z" />
            <Path d="M17.315 20.875H25.312V23.91H17.315z" />
        </Svg>
    )
}

export default ExposureIcon
