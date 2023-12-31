import Video from '~/components/Video';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import { BiSkipNextCircle } from 'react-icons/bi';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import * as videoListService from '~/services/getVideoList';
import LoadingIcon from '~/assets/LoadingIcon';
import Loading from '~/components/Loading/Loading';
import Loading2 from '~/components/Loading/Loading2';
import { useStore } from '~/hooks';
import { actions } from '~/store';

const cx = classNames.bind(styles);

function Home() {
    const bodyRef = useRef();
    const [active, setActive] = useState(false);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useStore();

    window.onscroll = () => {
        if (window.scrollY > 150) {
            setActive(true);
        } else setActive(false);
    };

    const backToTop = () => {
        bodyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    };
    // get data
    const [videoList, setVideoList] = useState([]);
    useEffect(() => {
        videoListService
            .getVideoList({ type: 'for-you', page })
            .then((res) => {
                const data = res.data;
                setVideoList((prev) => [...prev, ...data]);
                setMore(data.length > 0);
                setLoading(false);
                dispatch(actions.setListVideoWatchingRedux(data));
                // console.log('home', res);
            })
            .catch((error) => console.log(error));
    }, [page]);
    // load more video
    const observer = useRef();
    const lastVideoRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },

        [more],
    );

    return loading ? (
        // <div className={cx('loading')}>
        //     <LoadingIcon />
        // </div>
        <Loading2 />
    ) : (
        <div className={cx('body')} id="content" ref={bodyRef}>
            {videoList.map((account, index) => {
                if (videoList.length === index + 1) {
                    return (
                        <div ref={lastVideoRef} key={account.id}>
                            <Video data={account} />
                        </div>
                    );
                } else {
                    return <Video key={Math.random()} data={account} />;
                }
            })}
            <BiSkipNextCircle className={cx('back-to-top', active && 'active')} onClick={backToTop} />
        </div>
    );
}

export default memo(Home);
