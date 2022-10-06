import axios from 'axios';
import { Cookies } from 'react-cookie';
import qs from 'qs';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { IJSON, Values } from '../components/MainForm/interfaces';
import { getFormJSON } from '../helpres/mapFormValuesToJson';
import axiosWithCache from '../helpres/axiosWithCache';

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    const cookies = new Cookies();

    cookies.remove('isAdmin');
    cookies.remove('user');
    cookies.remove('canDoTwoOptions');
    cookies.remove('jwt');
  }
  return error;
});

export interface IComment {
  id: string,
  text: string,
  createdAt: string,
  author: {
    id: string,
    username: string,
  },
  story: {
    id: string,
  },
  answers: IComment[],
}

interface ILoginRequestArgs {
  login: string,
  password: string
}

interface ILoginRequestReturnValues {
  jwt: string,
  isAdmin: boolean,
  user: object,
  canDoTwoOptions: boolean,
}

interface ILoginRequest {
  (args: ILoginRequestArgs): Promise<null | ILoginRequestReturnValues>;
}

interface IAbsoluteOccupationGroup {
  id: string,
  title: string,
  absolute_occupations: {
    id: string,
    title: string,
  }[],
}

interface IAssetTypes {
  id: string,
  title: string,
  assets: {
    id: string,
    title: string,
  }[],
}

interface IStoryCategoriesGroup {
  id: string,
  title: string,
  story_categories_sub_groups: {
    id: string,
    title: string,
    story_categories: {
      id: string,
      title: string,
    }[],
  }[],
}

export interface ICheckMatch {
  message: string,
  context: {
    text: string,
    offset: 3,
    length: 5
  },
  rule: {
    description: string,
  }
}

interface ISkillGroup {
  id: string,
  title: string,
  skills: {
    id: string,
    title: string,
    skill_levels: {
      id: string,
      title: string,
    }[],
  }[],
}

export interface IAbsoluteOccupation {
  id: string,
  title: string,
  absolute_occupation_group: {
    id: string,
    title: string,
  }
}

export interface INPCAbsoluteOccupation {
  id: string,
  title: string,
}

export interface IActionReferences {
  id: string,
  title: string,
}

export interface IPerks {
  id: string,
  title: string,
}

export interface IFlag {
  id: string,
  title: string,
}

export interface IStoryCategory {
  id: string,
  title: string,
}

export interface IStoryHeaderColor {
  id: string,
  title: string,
  value: string,
  description: string,
}

export interface IAuthor {
  id: string,
  username: string,
}

export enum StoryStatus {
  DRAFT = 'DRAFT',
  REWRITE_REQUIRED = 'REWRITE_REQUIRED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  WAIT_FOR_APPROVE = 'WAIT_FOR_APPROVE',
  PAYMENT_IN_PROGRESS = 'PAYMENT_IN_PROGRESS',
  PAID = 'PAID',

  PAYMENT_ERROR = 'PAYMENT_ERROR',
  TO_BUILD = 'TO_BUILD',
  IN_BUILD = 'IN_BUILD',
  WAIT_PROOFREADING_OF_PAID = 'WAIT_PROOFREADING_OF_PAID',
  IN_PROOFREADING_OF_PAID = 'IN_PROOFREADING_OF_PAID',
  PROOFREADING_OF_PAID_DONE = 'PROOFREADING_OF_PAID_DONE',
  TEMPLATE = 'TEMPLATE',
  TRASH = 'TRASH',
  FOR_DELETION = 'FOR_DELETION',
}

export interface IAuthor {
  id: string,
  username: string,
}

export interface IStory {
  id: string,
  comment: string,
  status: StoryStatus,
  data: IJSON,
  formData: Values,
  createdAt: string,
  updatedAt: string,
  author: IAuthor,
  authorFinishDate?: string,
  proofreadingFinishDate?: string,
  editor?: IAuthor,
  fixed: boolean,
  story_comments: IComment[],
  calculatedRatingOne: number,
  calculatedRatingTwo: number,
  template?: ITemplate,
  templateName?: string,
  available?: boolean,
}

export interface ITemplate extends IStory {
  templateName: string,
  available: boolean,
}

interface ISort {
  field: string,
  sortDirection: 'ASC' | 'DESC',
}

export interface IFilter {
  field: string,
  value: string | number,
}

export interface IStoriesArgs {
  filter?: IFilter[],
  sort?: ISort
  start?: number,
  limit?: number,
  storyTextContain?: string,
  category?: string[],
}

export interface IRatingRecord {
  id: string,
  score: number,
  story: IStory,
  target: IAuthor,
  owner: IAuthor,
}

export interface IExcelRecordAuthor {
  [key: string]: {
    author: string,
    count: number,
    creditCardNumber: string,
    creditCardOwnerName: string,
    paypall: string,
  };
}

export interface IExcelRecordEditor {
  [key: string]: {
    editor: string,
    count: number,
    creditCardNumber: string,
    creditCardOwnerName: string,
    paypall: string,
  };
}

export interface IExcelRecords {
  authors: IExcelRecordAuthor[],
  editors: IExcelRecordEditor[],
}


interface ISearch {
  _sort?: string,
  _where?: { [key: string]: string | number }[]
  _start?: number,
  _limit?: number,
  storyTextContain?: string,
  category?: string[],
}

interface IChainStory {
  title: string;
  id: string;
}

class ApiClient {
  private readonly backendHost: string;

  constructor() {
    const backendHost = process.env.REACT_APP_BACKEND_HOST;

    if (!backendHost) {
      throw new Error('Specify REACT_APP_BACKEND_HOST in env files');
    }

    this.backendHost = backendHost;
  }

  private readonly headers = () => {
    const cookies = new Cookies();
    const jwt = String(cookies.get('jwt'));

    return {
      Authorization: `Bearer ${jwt}`,
    };
  };

  login: ILoginRequest = async ({ login, password }) => {
    const data = {
      identifier: login,
      password,
    };

    try {
      const result: any = await axios.post(`${this.backendHost}/auth/local`, data);
      const jwt = result?.data?.jwt;

      if (!jwt) {
        return null;
      }

      let isAdmin = false;
      if (result?.data?.user?.role?.name === 'Admin') {
        isAdmin = true;
      }

      const user = result?.data?.user || {};
      const canDoTwoOptions = result?.data?.user?.canDoTwoOptions || false;

      return {
        jwt,
        isAdmin,
        canDoTwoOptions,
        user,
      };
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return null;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchAbsoluteOccupations = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/absolute-occupations?_sort=title:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][title_contains]=${filterValue}`;
    }

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IAbsoluteOccupation[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchAbsoluteOccupationsGroups = async () => {
    let url = `${this.backendHost}/absolute-occupation-groups`;

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IAbsoluteOccupationGroup[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchAssetTypes = async () => {
    let url = `${this.backendHost}/asset-types`;

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IAssetTypes[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchStoryCategoriesGroups = async () => {
    let url = `${this.backendHost}/story-categories-groups`;

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IStoryCategoriesGroup[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  private _replaceTagsIteration = (text: string, i: number) => {
    return text
      .replaceAll(`%FirstName:Npc:${i}%`, 'John')
      .replaceAll(`%FullName:Npc:${i}%`, 'John')
      .replaceAll(`%FirstName:NPC:${i}%`, 'John')
      .replaceAll(`%FullName:NPC:${i}%`, 'John')
      .replaceAll(`%He/She:${i}%`, 'He')
      .replaceAll(`%Pron:${i}:1%`, 'He')
      .replaceAll(`%Him/Her:${i}%`, 'Him')
      .replaceAll(`%Pron:${i}:2%`, 'Him')
      .replaceAll(`%His/Her:${i}%`, 'His')
      .replaceAll(`%Pron:${i}:3%`, 'His')
      .replaceAll(`%His/Hers:${i}%`, 'His')
      .replaceAll(`%Pron:${i}:4%`, 'His')
      .replaceAll(`%Himself/Herself:${i}%`, 'Himself')
      .replaceAll(`%Pron:${i}:5%`, 'Himself')
      .replaceAll(`%Class:${i}%`, 'Colleague')
      .replaceAll(`%MrMs:${i}%`, 'Mr.')
      .replaceAll(`%LastName:${i}%`, 'Doe');
  };

  private _replaceTags = (text: string) => {
    let result = text;

    for (let i = 0; i < 4; i++) {
      result = this._replaceTagsIteration(result, i);
    }

    return result;
  };

  checkText = async (text: string) => {
    const formattedText = this._replaceTags(text);

    let url = `${this.backendHost}/lang-checks/check/${encodeURIComponent(formattedText)}`;

    try {
      const axiosWithCacheInstance = await axiosWithCache();

      const result: any = await axiosWithCacheInstance.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: ICheckMatch[] = result?.data?.matches;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  premiumCheckText = async (text: string) => {
    const formattedText = this._replaceTags(text);

    let url = `${this.backendHost}/lang-checks/check-premium/${encodeURIComponent(formattedText)}`;

    try {
      const axiosWithCacheInstance = await axiosWithCache();

      const result: any = await axiosWithCacheInstance.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: ICheckMatch[] = result?.data?.matches;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchSkillGroups = async () => {
    let url = `${this.backendHost}/skill-groups`;

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: ISkillGroup[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchActionReferences = async (filterValue?: string | undefined) => {
    // let url = `${this.backendHost}/action-references?_sort=title:ASC`;
    let url = `${this.backendHost}/action-references?_sort=title:ASC&_where[0][fromImport]=false`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[1][title_contains]=${filterValue}`;
    }

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IActionReferences[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchPerks = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/perks?_sort=title:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][title_contains]=${filterValue}`;
    }

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IPerks[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchFlags = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/flags?_sort=title:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][title_contains]=${filterValue}`;
    }

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IFlag[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchStoryFlags = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/flags-stories?_sort=title:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][title_contains]=${filterValue}`;
    }

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IFlag[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchNpcFlags = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/flag-npcs?_sort=title:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][title_contains]=${filterValue}`;
    }

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IFlag[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  fetchChainStories = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/chain-stories?_sort=title:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][title_contains]=${filterValue}`;
    }

    try {
      const result: any = await axios.request({
        url,
        method: 'get',
        headers: this.headers(),
      });

      const data: IChainStory[] = result?.data;

      return data;
    } catch (error: any) {
      if (error && error.response && error.response.status === 400) {
        return false;
      }

      console.error(error);
      throw new Error(error);
    }
  };

  private storiesStringifySearch = (args: IStoriesArgs = {}) => {
    const search: ISearch = {};

    if (args.sort) {
      search._sort = `${args.sort.field}:${args.sort.sortDirection}`;
    }

    if (args.filter && args.filter.length > 0) {
      search._where = map(args.filter, (item) => {
        return {
          [item.field]: item.value,
        };
      });
    }

    if (typeof args.start !== undefined) {
      search._start = args.start;
    }

    if (args.limit) {
      search._limit = args.limit;
    }

    if (args.storyTextContain) {
      search.storyTextContain = args.storyTextContain;
    }

    if (args.category) {
      search.category = args.category;
    }

    return qs.stringify(search);
  };

  fetchStories = async (args: IStoriesArgs = {}) => {
    const searchString = this.storiesStringifySearch(args);

    let url = `${this.backendHost}/stories?_sort=proofreadingFinishDate:ASC,authorFinishDate:ASC,createdAt:ASC`;
    if (searchString.length > 0) {
      url = `${url}&${searchString}`;
    }

    const result: any = await axios.request({
      url: url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IStory[] = result?.data;

    return data;
  };

  fetchRatingRecord = async (
    {
      storyId,
      authorId,
    }: {
      storyId: string,
      authorId: string,
    },
  ) => {
    const cookies = new Cookies();
    const user = cookies.get('user');

    const myId = user.id;

    const url = `${this.backendHost}/rating-records/?_where[0][owner]=${myId}&_where[1][story]=${storyId}&_where[2][target]=${authorId}&_limit=1`;

    const result: any = await axios.request({
      url: url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IRatingRecord[] = result?.data;

    if (data.length > 0) {
      return data[0];
    }

    return null;
  };

  fetchRating2Record = async (
    {
      storyId,
      authorId,
    }: {
      storyId: string,
      authorId: string,
    },
  ) => {
    const cookies = new Cookies();
    const user = cookies.get('user');

    const myId = user.id;

    const url = `${this.backendHost}/rating-2-records/?_where[0][owner]=${myId}&_where[1][story]=${storyId}&_where[2][target]=${authorId}&_limit=1`;

    const result: any = await axios.request({
      url: url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IRatingRecord[] = result?.data;

    if (data.length > 0) {
      return data[0];
    }

    return null;
  };

  upsertRatingRecord = async (
    {
      storyId,
      authorId,
      score,
      ratingId,
    }: {
      storyId: string,
      authorId: string,
      score: number,
      ratingId?: string,
    },
  ) => {
    const cookies = new Cookies();
    const user = cookies.get('user');

    const myId = user.id;

    const url = `${this.backendHost}/rating-records`;

    const requestData = {
      story: storyId,
      target: authorId,
      owner: myId,
      score,
    };

    // update
    if (ratingId) {
      const result: any = await axios.request({
        url: `${url}/${ratingId}`,
        method: 'put',
        data: requestData,
        headers: this.headers(),
      });

      const data: IRatingRecord = result?.data;

      return data;
    }

    // create
    const result: any = await axios.request({
      url,
      method: 'post',
      data: requestData,
      headers: this.headers(),
    });

    const data: IRatingRecord = result?.data;

    return data;
  };

  upsertRating2Record = async (
    {
      storyId,
      authorId,
      score,
      ratingId,
    }: {
      storyId: string,
      authorId: string,
      score: number,
      ratingId?: string,
    },
  ) => {
    const cookies = new Cookies();
    const user = cookies.get('user');

    const myId = user.id;

    const url = `${this.backendHost}/rating-2-records`;

    const requestData = {
      story: storyId,
      target: authorId,
      owner: myId,
      score,
    };

    // update
    if (ratingId) {
      const result: any = await axios.request({
        url: `${url}/${ratingId}`,
        method: 'put',
        data: requestData,
        headers: this.headers(),
      });

      const data: IRatingRecord = result?.data;

      return data;
    }

    // create
    const result: any = await axios.request({
      url,
      method: 'post',
      data: requestData,
      headers: this.headers(),
    });

    const data: IRatingRecord = result?.data;

    return data;
  };

  countStories = async (_args: IStoriesArgs = {}) => {
    const args = omit(_args, [ 'start', 'limit' ]);
    const searchString = this.storiesStringifySearch(args);

    let url = `${this.backendHost}/stories/count`;
    if (searchString.length > 0) {
      url = `${url}?${searchString}`;
    }
    const result: any = await axios.request({
      url: url,
      method: 'get',
      headers: this.headers(),
    });

    const data: number = result?.data || 0;

    return data;
  };

  fetchStory = async (id: string) => {
    const result: any = await axios.request({
      url: `${this.backendHost}/stories/${id}`,
      method: 'get',
      headers: this.headers(),
    });

    const data: IStory = result?.data;

    return data;
  };

  fetchAvailableTemplates = async () => {
    const result: any = await axios.request({
      url: `${this.backendHost}/story/available-templates`,
      method: 'get',
      headers: this.headers(),
    });

    const data: ITemplate[] = result?.data;

    return data;
  };

  updateStory = async (
    {
      id,
      formData,
      json,
      status = StoryStatus.DRAFT,
      comment = '',
      name,
      available = false,
      templateId,
    }: { id: string, formData: Values, json: string, status: StoryStatus, comment?: string, name?: string, available?: boolean, templateId?: string },
  ) => {
    const requestData = {
      data: json,
      comment,
      status,
      formData,
      template: templateId,
    };

    if (status === StoryStatus.TEMPLATE) {
      // @ts-ignore
      requestData.templateName = name;
      // @ts-ignore
      requestData.available = available;
    }

    const result: any = await axios.request({
      url: `${this.backendHost}/stories/${id}`,
      method: 'put',
      data: requestData,
      headers: this.headers(),
    });

    const data: IStory = result?.data;

    return data;
  };

  fetchStoryCategories = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/story-categories?_sort=title:ASC&_where[0][fromImport]=false`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[1][title_contains]=${filterValue}`;
    }

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IStoryCategory[] = result?.data;

    return data;
  };

  fetchStoryHeaderColors = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/story-header-colors?_sort=title:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][title_contains]=${filterValue}`;
    }

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IStoryHeaderColor[] = result?.data;

    return data;
  };

  fetchAuthors = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/stories/authors?_sort=username:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][username_contains]=${filterValue}`;
    }

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IAuthor[] = result?.data;

    return data;
  };

  fetchEditors = async (filterValue?: string | undefined) => {
    let url = `${this.backendHost}/stories/editors?_sort=username:ASC`;
    if (filterValue && filterValue.length > 0) {
      url = `${url}&_where[0][username_contains]=${filterValue}`;
    }

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IAuthor[] = result?.data;

    return data;
  };

  /**
   * Создание новой истории
   *
   * @param values
   * @param authorId
   * @param status
   * @param name
   * @param available
   */
  createStory = async (values: Values, authorId: string, status: StoryStatus = StoryStatus.DRAFT, name?: string, available: boolean = false, templateId?: string) => {
    const url = `${this.backendHost}/stories`;

    const json = getFormJSON(values);

    const requestData = {
      data: json,
      author: authorId,
      comment: '',
      status: status,
      formData: values,
      template: templateId,
    };

    if (status === StoryStatus.TEMPLATE) {
      // @ts-ignore
      requestData.templateName = name;
      // @ts-ignore
      requestData.available = available;
    }

    const result: any = await axios.request({
      url,
      method: 'post',
      data: requestData,
      headers: this.headers(),
    });

    const data: IStory = result?.data;

    return data;
  };

  appointStories = async (storiesIds: string[], editorId: string) => {
    const url = `${this.backendHost}/stories/appoint`;

    const requestData = {
      storiesIds,
      editorId,
    };

    const result: any = await axios.request({
      url,
      method: 'post',
      data: requestData,
      headers: this.headers(),
    });

    const data: any = result?.data;

    console.log('data', data);

    return data;
  };

  bulkTemplatesAvailableChange = async (storiesIds: string[], available: boolean) => {
    const url = `${this.backendHost}/stories/bulk-templates-available-change`;

    const requestData = {
      storiesIds,
      available,
    };

    const result: any = await axios.request({
      url,
      method: 'post',
      data: requestData,
      headers: this.headers(),
    });

    const data: any = result?.data;

    console.log('data', data);

    return data;
  };

  fetchPayInProgressStatusChangeBlocked = async () => {
    const url = `${this.backendHost}/system-settings`;

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: boolean = Boolean(result?.data?.PayInProgressStatusChangeBlocked);

    return data;
  };

  fetchAuthorCanCreateStory = async () => {
    const url = `${this.backendHost}/system-settings`;

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: boolean = Boolean(result?.data?.AuthorsCanCreateStory);

    return data;
  };

  fetchPaymentExcelData = async () => {
    const url = `${this.backendHost}/story/payment-excel`;

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IExcelRecords = result?.data;

    return data;
  };

  fetchCommentsByStory = async (storyId: string) => {
    const url = `${this.backendHost}/story-comments?_where[story]=${storyId}`;

    const result: any = await axios.request({
      url,
      method: 'get',
      headers: this.headers(),
    });

    const data: IComment[] = result?.data;

    return data;
  };

  addCommentToStory = async (storyId: string, text: string, replyTo?: string) => {
    const url = `${this.backendHost}/story-comments`;

    const requestData: any = {
      storyId,
      text,
    };

    if (replyTo) {
      requestData.replyTo = replyTo;
    }

    const result: any = await axios.request({
      url,
      data: requestData,
      method: 'post',
      headers: this.headers(),
    });

    const data: IComment[] = result?.data;

    return data;
  };

  updatePayInProgressStatusChangeBlocked = async (value: boolean) => {
    const url = `${this.backendHost}/system-settings`;

    const result: any = await axios.request({
      url,
      method: 'put',
      data: {
        PayInProgressStatusChangeBlocked: value,
      },
      headers: this.headers(),
    });

    const data: boolean = Boolean(result?.data?.PayInProgressStatusChangeBlocked);

    return data;
  };

  storiesBulkStatusChange = async (ids: string[], status: StoryStatus) => {
    const url = `${this.backendHost}/stories/bulk-status-change`;

    await axios.request({
      url,
      method: 'post',
      data: {
        ids,
        status,
      },
      headers: this.headers(),
    });

    return true;
  };
}

export default ApiClient;
