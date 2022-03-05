import { useParams } from "react-router-dom";
import LeagueShow from "./LeagueShow";



function LeagueDetail() {
    const routeParams = useParams();
        return (
            <main>
                <LeagueShow leagueID={routeParams.leagueID} />
            </main>
        );
}

export default LeagueDetail;

