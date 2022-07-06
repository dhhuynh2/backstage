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
  createServiceFactory,
  httpRouterServiceRef,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import express, { Handler } from 'express';

export const httpRouterFactory = createServiceFactory({
  service: httpRouterServiceRef,
  deps: {},
  factory: async () => {
    const app = express();
    const rootRouter = Router();

    app.use(rootRouter);
    app.listen(8123);

    return async (pluginId?: string) => {
      if (!pluginId) {
        return rootRouter;
      }
      return {
        use(handler: Handler) {
          rootRouter.use(`/api/${pluginId}`, handler);
        },
      };
    };
  },
});
