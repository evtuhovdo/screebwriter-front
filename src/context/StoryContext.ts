import React from 'react';
import { IStory } from '../Api/ApiClient';

export const StoryContext = React.createContext<IStory | undefined>(undefined);
