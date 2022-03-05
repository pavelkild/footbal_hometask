export default function MatchRow(props) {
    const {info} = props;
    return (
        <tr>
            <td className="eventDate"><p className="wrap"><span className="clearText numbers">{info.dateTime}</span></p></td>
            <td className="resultStatus" rel={info.statusCode}><p className="wrap"><span className="clearText">{info.statusText}</span></p></td>
            <td className="teamName homeTeam"><p className="wrap"><span className="clearText bold">{info.teamA}</span></p></td>
            <td className="fillSpace"><p className="wrap"><span className="clearText"> - </span></p></td>
            <td className="teamName awayTeam"><p className="wrap"><span className="clearText bold">{info.teamB}</span></p></td>
            <td className="resultScore numbers">
                <p className="wrap">
                    <span className="clearText brick marginRight bold">{info.scores.fullA} : {info.scores.fullB}</span>
                    <span className="muted marginRight">({info.scores.extraA} : {info.scores.extraB})</span>
                    <span className="muted marginRight">({info.scores.penaltyA} : {info.scores.penaltyB})</span>
                </p>
            </td>
        </tr>
    );
}