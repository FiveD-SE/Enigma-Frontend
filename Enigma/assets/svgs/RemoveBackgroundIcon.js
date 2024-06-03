import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RemoveBackgroundIcon(props) {
    return (
        <Svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path fill="none" d="M0 0H24V24H0z" />
            <Path d="M20.587 3.423L22 4.837 20 6.84V18a2 2 0 01-2 2H6.84l-2.007 2.006-1.414-1.414 17.167-17.17zM12.42 14.42l1 1 1-1a1.59 1.59 0 012.11.11L18 16V8.84l-5.58 5.58zM15.16 6H6v6.38l2.19-2.19 1.39 1.39L4 17.163V6a2 2 0 012-2h11.162l-2 2z" />
        </Svg>
    )
}

export default RemoveBackgroundIcon
