import SunsetBackground from "../images/Sunset.jpg";
import MeadowBackground from "../images/Meadow.jpg";
import AfterlifeHomeBackgroundRed from "../images/afterlife/HomeBackgroundRed.jpg";
import AfterlifeHomeBackgroundYellow from "../images/afterlife/HomeBackgroundYellow.jpg";

const reflectionsNovel = {
    novelId: 'reflections',
    title: "Reflections of the Lost",
    topMap: "Feuding Enclaves",
    navBarName: "Reflections",
    by: "John Petts and Sybil Harlow",
    aboutTheSite: "This site is an exploration of the locations featured in Sophie's adventure against the spriggans.",
    blurb: [
        "Ever meet faeries when you were a small child? Sophie did. She has seen them many times since, but they have been too skittish about her approaches.",
        "That is, until nightmarish fey kidnap a neighbor child. One she babysat often. Now, pursued by the same fey, she enters a dangerous world where faeries fear knife wielding creatures that can command the very earth she walks upon.",
        "She must avoid their curses, their attempts to steal her person and her memories all to rescue a small child that no one, not even her parents, knows is missing."
    ],
    homeBackgroundImage: SunsetBackground,
    homeSecondTitle: "The Meadow",
    homeSecondDescription: "Inspiration for the meadow in Eiserune.",
    homeSecondImage: MeadowBackground
}

const afterlifeNovel = {
    novelId: 'afterlife',
    title: "Afterlife",
    topMap: "Regional",
    navBarName: "Afterlife",
    by: "John Petts",
    aboutTheSite: "This site is an exploration of the locations featured in Haki and Armand's adventure to restore Unity.",
    blurb: [
        "Recently promoted to police Trooper, Armand would die for his family. Then he did.",
        "Haki may have escaped her upbringing, but she can’t outrun her past as a predator forever.",
        "Quadzo, a scientist who thinks he owns the dead, offers them everything they want and more. The price? They must betray their loved ones.",
        "While facing terrible choices, their new existences are further complicated by the Echolords, beings who bless their followers with powers to fight their petty wars. Refusal to cooperate could return them to the grave.",
        "Resuming their former lives might be the harder than reining in the Echolords. Armand’s twin brother is on the edge of a rage-fueled breakdown, while Haki’s adopted sister is a bitter orphan, twice over.",
        "Can they bring about the end of the war without betraying their loved ones?"
    ],
    homeBackgroundImage: AfterlifeHomeBackgroundRed,
    homeSecondTitle: "",
    homeSecondDescription: "",
    homeSecondImage: null
}

const novels = [reflectionsNovel, afterlifeNovel];

function getNovel(novelId) {
    const novel = novels.find((novel) => novel.novelId == novelId);
    if (novel) return novel;

    return reflectionsNovel;
}

export function sanitizeNovelId(novelId) {
    const novel = novels.find((novel) => novel.novelId == novelId);
    if (novel) return novel.novelId;

    return reflectionsNovel.novelId;
}

function identifyNovelIdFromHref(href) {

    const lowerCaseHref = href.toLowerCase();
    const novel = novels.find((novel) => lowerCaseHref.includes(novel.novelId));

    if (novel) return novel.novelId;

    return reflectionsNovel.novelId;
}

export function getTitle(novelId) {
    const novel = getNovel(novelId);

    return novel.title;
}

export function getBy(novelId) {
    const novel = getNovel(novelId);

    return novel.by;
}

export function getAboutTheSite(novelId) {
    const novel = getNovel(novelId);

    return novel.aboutTheSite;
}

export function getBlurb(novelId) {
    const novel = getNovel(novelId);
    
    return novel.blurb;
}

export function getTopMap(novelId) {
    const novel = getNovel(novelId);

    return novel.topMap;
}

export function getNavBarName(novelId) {
    const novel = getNovel(novelId);

    return novel.navBarName;
}

export function getHomeBackgroundImage(novelId) {
    const novel = getNovel(novelId);

    return novel.homeBackgroundImage;
}

export function getHomeSecondTitle(novelId) {
    const novel = getNovel(novelId);

    return novel.homeSecondTitle;
}

export function getHomeSecondDescription(novelId) {
    const novel = getNovel(novelId);

    return novel.homeSecondDescription;
}

export function getHomeSecondImage(novelId) {
    const novel = getNovel(novelId);

    return novel.homeSecondImage;
}

const novelService = { sanitizeNovelId, identifyNovelIdFromHref, getTitle, getBy, getAboutTheSite, getBlurb, getTopMap, getNavBarName,
                            getHomeBackgroundImage, getHomeSecondTitle, getHomeSecondDescription, getHomeSecondImage };
export default novelService;
