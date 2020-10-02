import React from 'react'
import "./infoBox.css"
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, activeBorderColorStyle, active, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && activeBorderColorStyle}`}>
            <CardContent>
                {/* Title i.e. Coronavirus cases */}
                <Typography className="infoBox__title">
                    {title}
                </Typography>
                
                {/* Number of cases: +120k */}
                <h2 className={`infoBox__cases`}>{cases}</h2>

                {/* Total number: 1.2M Total */}
                <Typography className="infoBox__total">
                    {total} Total
                </Typography>
                </CardContent>
        </Card>
    )
}

export default InfoBox
