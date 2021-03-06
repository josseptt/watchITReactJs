//Basic
import React from 'react'
//Components
import BoxImage from 'front/components/app-image/index.jsx'
import NavBarMenu from 'front/components/app-nav-bar-menu/index.jsx'
import AppMovieDetailInfo from 'front/components/app-movie-details-info/index.jsx'
import FlowText from 'front/components/util-flow-text/index.jsx'
import CustomScrollbars from 'front/components/util-scroller/index.jsx';
import ListCommaSplit from 'front/components/util-list-comma-split/index.jsx'
//Helpers
import cryptHelper from 'resources/helpers/cryptHelper'
//Setting
import settings from 'backend/settings'

export default class AppMovieDetail extends React.Component {
    constructor(props) {
        super(props);
        //Default state
        this.state = {
            torrent: null,
            sub: null
        }
    }

    setMenuItem(def, type = 'torrent') {
        this.prepareDataToPlayer(
            def, type
        )
    }


    prepareDataToPlayer(data, type = 'torrent') {
        //Handle type of menu
        if (type == 'torrent') {
            this.setState({
                torrent: cryptHelper.toBase64(
                    JSON.stringify({
                        torrent: data,
                        imdb_code: this.props.movie.imdb_code,
                        title: this.props.movie.title
                    })
                )
            })
        } else {
            this.setState({
                sub: data
            })
        }
    }


    prepareMenu(items, type = 'torrent') {
        //Prepare for menu structure
        return items.map((v, k)=> {
            return {
                default: (k == 0),
                label: type == 'torrent' && v.quality || (v[0].toUpperCase() + v.slice(1)),
                action: type == 'torrent' && v.url || v
            };
        });
    }


    render() {
        return (
            <div className="row">
                {/*Aside*/}
                <aside className="col l4 m4 movie-details-poster">
                    {/*Poster*/}
                    <BoxImage
                        className="full-width"
                        src={this.props.movie.large_cover_image}
                        placeholder={{w: 500, h: 750, c:true}}
                    />
                </aside>

                {/*Main Section*/}
                <section className="col l8 m8">
                    <header className="row">
                        {/*Title*/}
                        <div className="col l12 m12 s12 width-55-vw">
                            <h1 className="white-text margin-top-0 font-type-titles truncate">
                                {this.props.movie.title}
                            </h1>
                        </div>

                        {/*Movie Info*/}
                        <AppMovieDetailInfo
                            info={{
                                    year:this.props.movie.year,
                                    rating:this.props.movie.rating,
                                    runtime:this.props.movie.runtime,
                                    rate:this.props.movie.mpa_rating
                                }}
                        />
                    </header>

                    {/*Genres*/}
                    <section className="row">
                        <ListCommaSplit
                            list={this.props.movie.genres}
                        />
                    </section>

                    {/*Description*/}
                    <section className="row movie-details-description clearfix">
                        <CustomScrollbars
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            thumbMinSize={30}
                            universal={true}>
                            <FlowText>
                                <span>{this.props.movie.description_full}</span>
                            </FlowText>
                        </CustomScrollbars>

                    </section>

                    {/*Footer*/}
                    <footer className="row nav-bar-movie-details">
                        <nav className="col l12 m12 transparent z-depth-0">
                            <div className="nav-wrapper">
                                {/*Play*/}
                                <ul>
                                    <li className="dropdown">
                                        <a className="dropdown-button flow-text clearfix"
                                           href={"#/app/movie/play/" + this.state.torrent + '/' + this.state.sub }>
                                            <span className="font-light-gray right">Play</span>
                                            <i className="icon-controller-play normalize-small-icon float-left margin-right-5"/>
                                        </a>
                                    </li>
                                </ul>

                                {/*The resolution menu*/}
                                <NavBarMenu
                                    btnText="HD"
                                    onChange={(torrent) => this.setMenuItem(torrent)}
                                    getInitialItem={(t)=>this.setMenuItem(t.action)}
                                    list={this.prepareMenu(
                                        this.props.movie.torrents
                                    )}
                                />

                                {/*The resolution menu*/}
                                {
                                    Object.keys(this.props.movie.subtitles).length > 0 && <NavBarMenu
                                        btnText="" onChange={(s) => this.setMenuItem(s, 'sub')}
                                        getInitialItem={(s)=>this.setMenuItem(s.action, 'sub')}
                                        list={this.prepareMenu(
                                            Object.keys(this.props.movie.subtitles).filter((c)=> {
                                                return ~(settings.subs.available.indexOf(c));
                                            }), 'sub'
                                        )}
                                    />
                                }

                                {/*Watch Trailer
                                 <ul>
                                 <li className="dropdown">
                                 <a className="dropdown-button flow-text" href="#modal-trailer">
                                 <span className="font-light-gray right">Trailer</span>
                                 <i className="icon-video relative top-2 left margin-left-4"/>
                                 </a>
                                 </li>
                                 </ul>*/}
                            </div>
                        </nav>
                    </footer>
                </section>
            </div>

        )
    }
}
