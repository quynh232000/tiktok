import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import Image from '~/components/Image';

import styles from './Upload.module.scss';
import images from '~/assets/images';
import * as userService from '~/services/userService';

import { createBrowserHistory } from 'history';
import ToastMessage from '~/components/ToastMessage';
import { FormattedMessage } from 'react-intl';
import Loading from '~/components/Loading/Loading';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const linkImage1 =
    'https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/logo-7328701c910ebbccb5670085d243fc12.svg';
const linkImage2 =
    'https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/logotext-9b4d14640f93065ec36dab71c806e135.svg';
function Upload() {
    const whoViewList = [<FormattedMessage id="upload.comment" />, 'Friends', 'Private'];

    const [runcheck, setRuncheck] = useState(false);
    const [whoView, setWhoView] = useState(false);
    const [hasVideo, setHasVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);

    const [whoValue, setWhoValue] = useState('');

    const onUpload = () => {
        document.getElementById('input-upload').click();
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // get value
    const [description, setDescription] = useState('Ok');
    const [valueVideo, setValueVideo] = useState('');

    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    const handleValueVideo = async (e) => {
        const file1 = e.target.files[0];
        setVideoUrl(file1);
        if (file1) {
            const base64 = await getBase64(file1);

            setValueVideo(base64);
        }

        const file = document.querySelector('#input-upload').files[0];
        const preview = document.querySelector('#video-edit-upload');

        const reader = new FileReader();
        reader.addEventListener(
            'load',
            () => {
                preview.src = reader.result;
            },
            false,
        );
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {};
            setHasVideo(true);
        }
    };
    const formData = new FormData();
    formData.append('upload_file', videoUrl);
    formData.append('description', description);
    formData.append('thumbnail_time', '4');
    formData.append('viewable', 'public');
    formData.append('allows[]', 'comment');

    const handleSubmit = () => {
        // setLoadData(true);
        setLoading(true);
        userService.postCreateVideo(formData).then((data) => {
            if (data) {
                setLoading(false);
                // setLoadData(false);
                alert('Upload video is succeeded');
                setValueVideo('');
                setHasVideo(false);
                // toast('Upload video successfully!');
            }
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('loading-icon')}>
                {/* {loadData && <LoadingIcon className={cx('icon-load')} />} */}
                {/* {loadData && <ToastMessage />} */}
                {loading && <Loading />}
            </div>
            <div className={cx('body')}>
                <div className={cx('upload')}>
                    <div className={cx('upload-title')}>
                        <FormattedMessage id="upload.title1" />
                    </div>
                    <div className={cx('upload-title-small')}>
                        <FormattedMessage id="upload.title2" />
                    </div>
                    <div className={cx('upload-body')}>
                        <div className={cx('left')}>
                            {hasVideo ? (
                                <div className={cx('left-video-background')}>
                                    <Image src={images.phoneBackground} className={cx('left-video-background')} />
                                    {valueVideo && (
                                        <video className={cx('left-video')} id="left-video" controls>
                                            <source src={valueVideo} />
                                        </video>
                                    )}
                                </div>
                            ) : (
                                <div className={cx('left-wrapper')} onClick={onUpload}>
                                    <input
                                        type="file"
                                        name="file_url"
                                        // value={valueVideo}
                                        onChange={handleValueVideo}
                                        id="input-upload"
                                        className={cx('input-upload')}
                                    />
                                    <Image
                                        className={cx('left-icon')}
                                        src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/cloud-icon1.ecf0bf2b.svg"
                                    />
                                    <div className={cx('left-text-main')}>
                                        <FormattedMessage id="upload.select" />
                                    </div>
                                    <div className={cx('left-text-sub')}>
                                        <FormattedMessage id="upload.orDrag" />
                                    </div>
                                    <div className={cx('left-text-video-info')}>
                                        MP4 <FormattedMessage id="upload.or" /> WebM
                                    </div>
                                    <div className={cx('left-text-video-info')}>
                                        <FormattedMessage id="upload.solution" />
                                    </div>
                                    <div className={cx('left-text-video-info')}>
                                        <FormattedMessage id="upload.upTo" />
                                    </div>
                                    <div className={cx('left-text-video-info')}>
                                        <FormattedMessage id="upload.less" />
                                    </div>
                                    <Button primary className={cx('left-select-btn')}>
                                        <FormattedMessage id="upload.selectFile" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className={cx('right')}>
                            <div className={cx('caption-wrap')}>
                                <div className={cx('label', 'label-caption')}>
                                    <p>
                                        <FormattedMessage id="upload.caption" />
                                    </p>{' '}
                                    <span>0 / 150</span>
                                </div>
                                <div className={cx('box', 'box-input')}>
                                    <input
                                        type="text"
                                        value={description}
                                        name="description"
                                        onChange={handleDescription}
                                        className={cx('input')}
                                    />
                                    <div className={cx('input-style')}>
                                        <span>@</span>
                                        <span>#</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('caption-wrap')}>
                                <div className={cx('label')}>
                                    <FormattedMessage id="upload.cover" />
                                </div>

                                <div className={cx('box', 'box-cover')}>
                                    <div className={cx('cover-video')}>
                                        <video controls id="video-edit-upload" className={cx('cover-video')}>
                                            <source src="" />
                                        </video>
                                    </div>

                                    <div className={cx('cover-video')}></div>
                                </div>
                            </div>

                            <div className={cx('caption-wrap')}>
                                <div className={cx('label')}>
                                    <FormattedMessage id="upload.who" />
                                </div>
                                <div className={cx('box', 'box-public')} onClick={() => setWhoView(!whoView)}>
                                    <p>{whoValue || <FormattedMessage id="upload.comment" />}</p>
                                    <AiFillCaretDown className={cx('icon-down', whoView && 'route')} />
                                    {whoView && (
                                        <div className={cx('choose-module')}>
                                            {whoViewList.map((data, index) => (
                                                <div
                                                    className={cx('choose-item')}
                                                    key={index}
                                                    onClick={() => setWhoValue(data)}
                                                >
                                                    <span className={cx('choose-text')}>{data}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={cx('caption-wrap')}>
                                <div className={cx('label')}>
                                    <FormattedMessage id="upload.allow" />:
                                </div>
                                <div className={cx('allow-check')}>
                                    <div className={cx('allow-check-item')}>
                                        <input type="checkbox" />
                                        <p>
                                            <FormattedMessage id="upload.comment" />
                                        </p>
                                    </div>
                                    <div className={cx('allow-check-item')}>
                                        <input type="checkbox" />
                                        <p>Duet</p>
                                    </div>
                                    <div className={cx('allow-check-item')}>
                                        <input type="checkbox" />
                                        <p>Stitch</p>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('label', 'label-run')}>
                                <p>
                                    <FormattedMessage id="upload.run" />
                                </p>{' '}
                                <div
                                    className={cx('switch', runcheck && 'turn-on')}
                                    onClick={() => setRuncheck(!runcheck)}
                                >
                                    <p className={cx('switch-inner')}></p>
                                </div>
                            </div>
                            {runcheck ? (
                                <div className={cx('text-run-on')}>
                                    <BiErrorCircle className={cx('text-run-on-icon')} />
                                    <p>
                                        <FormattedMessage id="upload.copyright" />
                                    </p>
                                </div>
                            ) : (
                                <div className={cx('text-run-off')}>
                                    <FormattedMessage id="upload.well" />
                                    <span>
                                        <FormattedMessage id="upload.more" />
                                    </span>
                                </div>
                            )}
                            <div className={cx('btn-body')}>
                                <Button outline large className={cx('btn')}>
                                    <FormattedMessage id="upload.cancel" />
                                </Button>
                                <Button
                                    outline
                                    large
                                    className={cx('btn', valueVideo ? 'btn-active' : 'disabled')}
                                    onClick={valueVideo && handleSubmit}
                                >
                                    <FormattedMessage id="upload.post" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className={cx('footer', 'grid')}>
                <div className={cx('footer-start')}>
                    <div className={cx('image')}>
                        <Image src={linkImage1} />
                        <Image src={linkImage2} />
                    </div>
                    <div className={cx('footer-list')}>
                        <h4 className={cx('footer-label')}>Company</h4>
                        <Link className={cx('footer-item')} to="#">
                            About
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            TikTok Browse
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Newsroom
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Contact
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Career
                        </Link>
                    </div>

                    <div className={cx('footer-list')}>
                        <h4 className={cx('footer-label')}>Programs</h4>
                        <Link className={cx('footer-item')} to="#">
                            TikTok for Good
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Advertise
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Developes
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            TiTok Rewards
                        </Link>
                    </div>

                    <div className={cx('footer-list')}>
                        <h4 className={cx('footer-label')}>Support</h4>
                        <Link className={cx('footer-item')} to="#">
                            Help Center
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Safety Center
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Creator Portal
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Community Guidelines
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Transparency
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Accessibility
                        </Link>
                    </div>

                    <div className={cx('footer-list')}>
                        <h4 className={cx('footer-label')}>Legal</h4>
                        <Link className={cx('footer-item')} to="#">
                            Terms of Use
                        </Link>
                        <Link className={cx('footer-item')} to="#">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
                <div className={cx('footer-end')}>
                    <div className={cx('footer-lang')}>
                        <p>English</p>
                        <AiFillCaretDown />
                    </div>
                    <span className={cx('footer-copy-right')}>© 2022 TikTok</span>
                </div>
            </footer>
        </div>
    );
}

export default Upload;
