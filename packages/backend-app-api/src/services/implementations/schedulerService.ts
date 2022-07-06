/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  configServiceRef,
  createServiceFactory,
  schedulerServiceRef,
} from '@backstage/backend-plugin-api';
import { TaskScheduler } from '@backstage/backend-tasks';

export const schedulerFactory = createServiceFactory({
  service: schedulerServiceRef,
  deps: {
    configFactory: configServiceRef,
  },
  factory: async ({ configFactory }) => {
    const config = await configFactory('root');
    const taskScheduler = TaskScheduler.fromConfig(config);
    return async (pluginId: string) => {
      return taskScheduler.forPlugin(pluginId);
    };
  },
});
