import { Component } from "react";
import BreadCrumbs from "../Static/breadCrumbs";
import CommonHelp from "../help";
import MatchRow from "./MatchRow";
import ErrorMessage from '../Static/ErrorMessage';
import ListPagination from './ListPagination';
import '../components/pagination.css';
import './leagueCard.css';

class LeagueShow extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            dataStatus: {
                error: false,
                text: "⭮ Ожидаются данные",
                code: 200,
            },
            dataLoaded: false,
            dataLength: 0,
            league: {
                id: this.props.leagueID,
                label: ""
            },
            filters: {
                dateFrom: null,
                dateTo: null
            },
            listData: [],
            clientOptions: {
                pages: [],
                activePage: 1,
                pageStepCount: window.innerWidth > 400 ? 4 : 2,
                itemsPerPage: window.innerWidth > 400 ? 20 : 10,
                shownData: []
            },
            minOuterHeight: {minHeight: 0}
        };
        this.output = this.output.bind(this);
        this.setDates = this.setDates.bind(this);
    }

    output(e) {
        let CH = new CommonHelp(),
            page = CH.pageFromUri();

        if ( page !== this.state.clientOptions.activePage ) {

            let theState = {}, shownData;
                            
            Object.assign(theState, this.state);
            theState.clientOptions.activePage = page;
            shownData = CH.showCurrentWindow(theState);

            this.setState((state, props) => ({clientOptions: {
                activePage: page, 
                shownData: shownData.list, 
                maxPage: shownData.maxPage,
                pages: shownData.pages,
                pageStepCount: state.clientOptions.pageStepCount,
                itemsPerPage: state.clientOptions.itemsPerPage
            }}));
        }
    }

    initData(filters, forced = false) {
        filters = filters || this.state.filters;

        if ( !this.state.dataLoaded || forced === true) {
            let CH = new CommonHelp(),
                page = CH.pageFromUri(),
                filtersSearch = [];
            for (let key in filters) {
                if ( filters.hasOwnProperty(key) && filters[key] !== null )
                    filtersSearch.push(`${key}=${encodeURIComponent(filters[key])}`);
            }

            const URI = `${process.env.REACT_APP_API_LEAGUES_URI}${this.props.leagueID}/matches` + ( filtersSearch.length > 0 ? `?${filtersSearch.join('&')}` : '' );

            fetch(URI, {
                method: "GET", 
                headers: { 'X-Auth-Token': process.env.REACT_APP_API_CODE }
            }).then(  
                function(response) {  
                    if (response.status !== 200) {  
                        let defaultErrorText = "Данные не найдены",
                            eDict = {
                                400: "Программисты всё сломали",
                                401: "Кажется, нужен специальный пароль",
                                403: "Не хватает прав доступа",
                                429: "Попробуйте обновить страницу через минуту",
                                404: "А такая лига вообще есть?"
                            }, errorText = eDict.hasOwnProperty(response.status) ? eDict[response.status] : defaultErrorText;
                        this.setState({dataStatus: { error: true, text: errorText, code:response.status }}); 
                        return;  
                    }

                    response.json().then(function(data) {
                        let matches = [];
                        
                        for (let i = 0; i < data.count; i ++) {
                            matches.push({
                                id: data.matches[i].id,
                                dateFilter: data.matches[i].utcDate.split('T')[0],
                                dateTime: CH.formatDateFromString(data.matches[i].utcDate),
                                statusCode: data.matches[i].status,
                                statusText: CH.matchStatus(data.matches[i].status), 
                                teamA: data.matches[i].homeTeam.name,
                                teamB: data.matches[i].awayTeam.name,
                                scores: {
                                    fullA: +(data.matches[i].score.fullTime.homeTeam),
                                    fullB: +(data.matches[i].score.fullTime.awayTeam),
                                    extraA: +(data.matches[i].score.extraTime.homeTeam),
                                    extraB: +(data.matches[i].score.extraTime.awayTeam),
                                    penaltyA: +(data.matches[i].score.penalties.homeTeam),
                                    penaltyB: +(data.matches[i].score.penalties.awayTeam)
                                }
                            });
                        }

                        let theState = {}, shownData;
                        
                        Object.assign(theState, this.state);
                        theState.dataLength = data.count;
                        theState.listData = matches.slice();
                        theState.clientOptions.activePage = page;
                        shownData = CH.showCurrentWindow(theState);

                        this.setState((state, props) => ({
                            dataLoaded: true,
                            dataStatus: { error: false, text: "Данные успешно загружены", code: 200 },
                            dataLength: data.count, 
                            league: { 
                                label: data.competition.name,
                                id: state.league.id,
                            },
                            filters: {
                                dateFrom: state.filters.dateFrom,
                                dateTo: state.filters.dateTo
                            },
                            listData: matches.slice(),
                            clientOptions: { 
                                activePage: page, 
                                shownData: shownData.list, 
                                pages: shownData.pages,
                                maxPage: shownData.maxPage,
                                pageStepCount: state.clientOptions.pageStepCount,
                                itemsPerPage: state.clientOptions.itemsPerPage
                            }
                        })); 
                        
                    }.bind(this));
                }.bind(this)  
            ).catch(function(err) {  
                let defaultErrorText = "Данные не найдены",
                    eDict = {
                        400: "Программисты всё сломали",
                        401: "Кажется, нужен специальный пароль",
                        403: "Не хватает прав доступа",
                        429: "Попробуйте обновить страницу через минуту",
                        404: "А такая лига вообще есть?"
                    }, errorText = eDict.hasOwnProperty(err.code) ? eDict[err.code] : defaultErrorText;
                this.setState({dataStatus: { error: true, text: errorText, code: err.code }}); 
            }.bind(this));
        }
    }

    setDates() {
        if (this.state.dataLoaded) {
            let filters ={
                dateFrom: document.getElementById("date-from-input").value === '' ? this.state.listData[0].dateFilter : document.getElementById("date-from-input").value,
                dateTo: document.getElementById("date-to-input").value === '' ? this.state.listData[this.state.listData.length - 1].dateFilter : document.getElementById("date-to-input").value
            };

            this.setState({dateLoaded: false, filters: filters});
            this.initData(filters, true);
        }
    }

    filtersChanged(prevFilters) {
        this.setDates();
    }

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState.filters) !== JSON.stringify(this.state.filters)) {
            this.filtersChanged(prevState.filters);
        }
        if ( this.state.dataLoaded ) {
            let newHt = document.getElementById('parentContainer').clientHeight;
            
            if (newHt > this.state.minOuterHeight.minHeight) {
                this.setState({minOuterHeight: {minHeight: newHt}});
                this.forceUpdate();
            }
        }
        
    }

    render () {
        return this.state.dataStatus.error ? (
            <ErrorMessage header="Что-то пошло не так" message={this.state.dataStatus.text} />
        ) : (
            <div className="container">
                <BreadCrumbs current={this.state.league} categoryLink={{link: "/leagues", label: "Все лиги"}} />
                <h2>Матчи <span className="leagueTitle">{this.state.league.label}</span></h2>
                <p className="cleanText row">
                    <span className="brick pre-input-label toMiddle">с</span><input type="date" className="toMiddle" id="date-from-input" />
                    <span className="clearForXs"></span>
                    <span className="brick pre-input-label toMiddle">по</span><input type="date" className="toMiddle" id="date-to-input" />
                    <span className="clearForXs"></span>
                    <span className="btn applyDate toMiddle" onClick={this.setDates}> найти </span>
                </p>
                <div id="parentContainer" style={this.state.minOuterHeight}>
                    <table className="matchesList">
                        <tbody>
                        {this.state.dataLoaded ? this.state.clientOptions.shownData.map(
                            (item) => <MatchRow key={item.id} info={item} />
                        ) : <tr><td></td></tr>}
                        </tbody>
                    </table>
                </div>
                {this.state.dataLoaded ? <ListPagination cbFunc={this.output} curPage={this.state.clientOptions.activePage} pages={this.state.clientOptions.pages} maxPage={this.state.clientOptions.maxPage} /> : ''}
            </div>
        );
    }
}

export default LeagueShow;