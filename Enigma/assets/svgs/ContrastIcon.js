import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ContrastIcon = (props) => {
    return (
        <Svg
            width="800px"
            height="800px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M126 4049c0-4.411 3.589-8 8-8v16c-4.411 0-8-3.589-8-8m8-10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10"
                transform="translate(-180 -4199) translate(56 160)"
                fill="#000"
                stroke="none"
                strokeWidth={1}
                fillRule="evenodd"
            />
        </Svg>
    )
}

export default ContrastIcon
