import Svg, { Path, Circle, Rect } from 'react-native-svg';

export type IconName = 'bell' | 'lock' | 'blocked' | 'help' | 'support' | 'document' | 'chevron-right' | 'trash' | 'compose' | 'info' | 'search' | 'plus' | 'heart' | 'comment' | 'send' | 'bookmark' | 'home' | 'explore' | 'profile' | 'close' | 'grid' | 'video' | 'tagged' | 'person-plus' | 'back' | 'camera' | 'bio' | 'link' | 'location' | 'sign-out' | 'settings' | 'phone' | 'video-call' | 'photo' | 'check' | 'double-check' | 'chat-send';

export function FeedIcon({ name, size = 24, color = '#101B32', filled = false }: { name: IconName; size?: number; color?: string; filled?: boolean }) {
  const stroke = color;
  const fill = filled ? color : 'none';
  const sw = name === 'grid' ? '2.6' : '1.9';

  const icons: Record<IconName, React.ReactNode> = {
    bell: <><Path d="M4 18h16l-2-3V9a6 6 0 0 0-12 0v6l-2 3Z" /><Path d="M10 21a3 3 0 0 0 4 0" /></>,
    lock: <><Rect x="4" y="10" width="16" height="12" rx="2" /><Path d="M7 10V6a5 5 0 0 1 10 0v4M12 15v2" /></>,
    blocked: <><Circle cx="12" cy="12" r="10" /><Path d="m5 5 14 14" /></>,
    help: <><Circle cx="12" cy="12" r="10" /><Path d="M9 9a3 3 0 1 1 4 3c-1 .5-1 1-1 2M12 17v.2" /></>,
    support: <Path d="M3 22V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H7l-4 4Z" />,
    document: <Path d="M14 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8l-6-6ZM14 2v6h6M8 11h3M8 15h8M8 18h8" />,
    'chevron-right': <Path d="m9 4 7 8-7 8" />,
    trash: <Path d="M3 5h18M9 5V2h6v3M5 5l1 17h12l1-17M10 9v9M14 9v9" />,
    compose: <Path d="M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M14 3l3-2 5 5-3 3-8 8-5 1 1-5 7-10ZM14 3l5 6" />,
    info: <><Circle cx="12" cy="12" r="9" /><Path d="M12 11v6M12 7v.2" /></>,
    search: <><Circle cx="10.5" cy="10.5" r="7.5" /><Path d="m16 16 5 5" /></>,
    plus: <Path d="M12 4v16M4 12h16" />,
    heart: <Path d="M20.8 4.6a5.6 5.6 0 0 0-8 .1L12 5.5l-.8-.8a5.6 5.6 0 0 0-8 7.9L12 21l8.8-8.4a5.6 5.6 0 0 0 0-8Z" />,
    comment: <Path d="M21 11.5a9 9 0 0 1-9.5 9 10 10 0 0 1-4-.9L2 22l1.7-5.6A9 9 0 1 1 21 11.5Z" />,
    send: <><Path d="m2 3 20-1-8 20-4-10-8-9Z" /><Path d="m10 12 12-10" /></>,
    bookmark: <Path d="M5 3h14v19l-7-5-7 5V3Z" />,
    home: <Path d="m2 10 10-8 10 8v12h-7v-8H9v8H2V10Z" />,
    explore: <><Circle cx="12" cy="12" r="10" /><Path d="m16 7-3 7-6 3 3-7 6-3Z" /></>,
    profile: <><Circle cx="12" cy="6" r="4" /><Path d="M3 22v-2a9 7 0 0 1 18 0v2" /></>,
    close: <Path d="m5 5 14 14M5 19 19 5" />,
    grid: <><Rect x="3" y="3" width="18" height="18" rx="1" /><Path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></>,
    video: <><Rect x="3" y="3" width="18" height="18" rx="6" /><Path d="m9 8 7 4-7 4V8ZM7 3l3 4M13 3l3 4" /></>,
    tagged: <><Path d="M9 4 11 1h2l2 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5Z" /><Circle cx="12" cy="10" r="3" /><Path d="M6 21v-2a6 4 0 0 1 12 0v2" /></>,
    'person-plus': <><Circle cx="10" cy="6" r="4" /><Path d="M14 14a8 7 0 0 0-12 7h12M19 13v8M15 17h8" /></>,
    back: <Path d="m15 3-9 9 9 9" />,
    camera: <><Path d="M4 6h4l2-3h4l2 3h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><Circle cx="12" cy="13" r="5" /></>,
    bio: <><Path d="M3 5h18M3 11h14M3 17h8" /><Circle cx="18" cy="18" r="2" /></>,
    link: <Path d="M10 13a5 5 0 0 0 7 .4l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.4l-3 3a5 5 0 0 0 7 7l2-2" />,
    location: <><Path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z" /><Circle cx="12" cy="9" r="2.5" /></>,
    'sign-out': <Path d="M11 3H4v18h7M10 12h12m-5-5 5 5-5 5" />,
    settings: <><Path d="m9.5 2-.5 3a8 8 0 0 0-1.5.9L4.6 5l-2.5 4.3 2.4 1.9a8 8 0 0 0 0 1.6l-2.4 1.9L4.6 19l2.9-.9A8 8 0 0 0 9 19l.5 3h5l.5-3a8 8 0 0 0 1.5-.9l2.9.9 2.5-4.3-2.4-1.9a8 8 0 0 0 0-1.6l2.4-1.9L19.4 5l-2.9.9A8 8 0 0 0 15 5l-.5-3h-5Z" /><Circle cx="12" cy="12" r="3" /></>,
    phone: <Path d="m5 3 4 4-2 3a16 16 0 0 0 7 7l3-2 4 4-2 3C10 23 1 14 2 5l3-2Z" />,
    'video-call': <><Rect x="2" y="5" width="14" height="14" rx="3" /><Path d="m16 9 6-3v12l-6-3" /></>,
    photo: <><Rect x="3" y="3" width="18" height="18" rx="4" /><Path d="m3 16 6-6 5 5 3-3 4 4" /></>,
    check: <Path d="m5 12 5 5L20 6" />,
    'double-check': <Path d="m2 12 5 5L17 6M11 16l2 2L23 7" />,
    'chat-send': <><Path d="m22 2-7 20-5-9-9-4 21-7Z" fill="white" /><Path d="m10 13 8-7" stroke="#087EFF" /></>,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </Svg>
  );
}