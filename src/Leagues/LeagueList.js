import LeagueCard from './LeagueCard';
import { Component } from 'react';
import CommonHelp from '../help';
import ListPagination from './ListPagination';
import '../components/pagination.css';
import ErrorMessage from '../Static/ErrorMessage';

import './leagues.css';

class LeagueList extends Component {
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
            dataFilter: {},
            listData: [],
            clientOptions: {
                pages: [],
                activePage: 1,
                pageStepCount: window.innerWidth > 400 ? 4 : 2,
                itemsPerPage: window.innerWidth > 400 ? 20 : 10,
                shownData: []
            },
            minOuterHeight: {minHeight: 0},
            searching: false,
            rawData: []
        }
        this.output = this.output.bind(this);
        this.searchIt = this.searchIt.bind(this);
        this.awaitForSearchEnter = this.awaitForSearchEnter.bind(this);
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

    initData() {
        let CH = new CommonHelp(),
            page = CH.pageFromUri();

        if ( !this.state.dataLoaded ) {
            fetch(process.env.REACT_APP_API_LEAGUES_URI, {
                method: "GET", 
                headers: { 'X-Auth-Token': process.env.REACT_APP_API_CODE }
            }).then(  
                function(response) {  
                    if (response.status !== 200) {  
                        let defaultErrorText = "Ошибка загрузки данных",
                            eDict = {
                                400: "Программисты всё сломали",
                                401: "Кажется, нужен специальный пароль",
                                403: "Стоит подумать о платной подписке",
                                429: "Попробуйте обновить страницу через минуту",
                                404: "Источник данных не найден"
                            }, errorText = eDict.hasOwnProperty(response.status) ? eDict[response.status] : defaultErrorText;
                        this.setState({dataStatus: { error: true, text: errorText, code: response.status }});
                        return;  
                    }

                    response.json().then(function(data) {
                        let listAr = [];
                        
                        for (let i = 0; i < data.count; i ++) {
                            listAr.push({
                                id: data.competitions[i].id,
                                name: data.competitions[i].name,
                                area: { 
                                    id: data.competitions[i].area.id,
                                    name: data.competitions[i].area.name
                                }
                            })
                        }

                        let theState = {}, shownData;
                        
                        Object.assign(theState, this.state);
                        theState.dataLength = data.count;
                        theState.listData = listAr.slice();
                        theState.clientOptions.activePage = page;
                        shownData = CH.showCurrentWindow(theState);

                        this.setState((state, props) => ({
                            dataLoaded: true,
                            dataStatus: { error: false, text: "Данные успешно загружены", code: 200 },
                            dataLength: data.count, 
                            dataFilter: data.filter,
                            listData: listAr.slice(),
                            rawData: listAr.slice(),
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
                this.setState({dataStatus: { error: true, text: "Ошибка прав доступа", code: err.code }}); 
            }.bind(this));
        }
    }

    awaitForSearchEnter(e) {
        if ( e.charCode === 13 ) {
            this.searchIt();
        }
    }

    searchIt() {
        let CH = new CommonHelp();
        let theState = {}, shownData;
        let searchValue = document.getElementById("search").value
        if ( searchValue === '' ) {
            if ( this.state.searching ) {
                Object.assign(theState, this.state);
                theState.listData = this.state.rawData.slice();
                theState.clientOptions.activePage = 1;
                shownData = CH.showCurrentWindow(theState);

                this.setState((state, props) => ({
                    listData: resultData.slice(),
                    searching: false,
                    clientOptions: {
                        activePage: 1, 
                        shownData: shownData.list, 
                        maxPage: shownData.maxPage,
                        pages: shownData.pages,
                        pageStepCount: state.clientOptions.pageStepCount,
                        itemsPerPage: state.clientOptions.itemsPerPage
                    }
                }));
            } else return;
        }

        const currentData = this.state.rawData.slice();
        let resultData = [];

        for (let i = 0; i < currentData.length; i ++ ) {
            const toSearch = `${currentData[i].name} ${currentData[i].area.name}`;
            const test = (new RegExp(searchValue, 'i')).test(toSearch);
            if ( test ) resultData.push(currentData[i]);
        }
                        
        Object.assign(theState, this.state);
        theState.listData = resultData.slice();
        theState.clientOptions.activePage = 1;
        shownData = CH.showCurrentWindow(theState);

        this.setState((state, props) => ({
            listData: resultData.slice(),
            searching: true,
            clientOptions: {
                activePage: 1, 
                shownData: shownData.list, 
                maxPage: shownData.maxPage,
                pages: shownData.pages,
                pageStepCount: state.clientOptions.pageStepCount,
                itemsPerPage: state.clientOptions.itemsPerPage
            }
        }));
    }

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate() {
        if ( this.state.dataLoaded ) {
            let newHt = document.getElementById('parentContainer').clientHeight;
            
            if (newHt > this.state.minOuterHeight.minHeight) {
                this.setState({minOuterHeight: {minHeight: newHt}});
                this.forceUpdate();
            }
        }
    }

    render() {
        let errorMsg = <ErrorMessage header="Что-то пошло не так" message={this.state.dataStatus.text} />;
        let plainHTML = (
             <>
            <h1>Лиги</h1>
                <div className="searchContainer">
                    <label htmlFor="search" className="searchLabel">
                        <input type="text" id="search" placeholder="Поиск по лигам" onKeyPress={this.awaitForSearchEnter} />
                        <span className="searchHandler" onClick={this.searchIt}></span>
                    </label>
                </div>
                <div className="leagueListContainer" key="league-list-container" >
                    <p key="league-list-container-loader-info muted" className={this.state.dataLoaded ? 'hidden' : 'loadingStatus'}>{this.state.dataStatus.text}</p>
                    <div className="leagueListWrapper row" key="league-list-wrapper" id="parentContainer" style={this.state.minOuterHeight}>
                    {this.state.dataLoaded ? this.state.clientOptions.shownData.map(
                        (item, index)=> <LeagueCard key={item.id} item={item} />
                    ) : ''}
                    </div>
                </div>
                {this.state.dataLoaded ? <ListPagination cbFunc={this.output} curPage={this.state.clientOptions.activePage} pages={this.state.clientOptions.pages} maxPage={this.state.clientOptions.maxPage} /> : ''}
                </>   
            );
        

        return (
            <main className='container'>
               {this.state.dataStatus.error ? errorMsg : plainHTML} 
            </main>
        )
    }
}

export default LeagueList;