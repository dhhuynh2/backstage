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
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { catalogApiRef } from '../../api';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import {
  bindHover,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { useApiHolder } from '@backstage/core-plugin-api';
import {
  isGroupEntity,
  isUserEntity,
  parseEntityRef,
} from '@backstage/catalog-model';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import {
  EntityCardActions,
  UserCardActions,
  GroupCardActions,
} from './CardActionComponents';
import { debounce } from 'lodash';

/**
 * Properties for an entity popover on hover of a component.
 *
 * @public
 */
export type EntityPeekAheadPopoverProps = PropsWithChildren<{
  entityRef: string;
  delayTime?: number;
}>;

const useStyles = makeStyles(() => {
  return {
    trigger: {
      display: 'inline-block',
    },
    popoverPaper: {
      width: '30em',
    },
    descriptionTypography: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
  };
});

const maxTagChips = 4;

/**
 * Shows an entity popover on hover of a component.
 *
 * @public
 */
export const EntityPeekAheadPopover = (props: EntityPeekAheadPopoverProps) => {
  const { entityRef, children, delayTime = 500 } = props;

  const classes = useStyles();
  const apiHolder = useApiHolder();
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'entity-peek-ahead',
  });
  const compoundEntityRef = parseEntityRef(entityRef);
  const [isHovered, setIsHovered] = useState(false);

  const debouncedHandleMouseEnter = debounce(
    () => setIsHovered(true),
    delayTime,
  );

  const [{ loading, error, value: entity }, load] = useAsyncFn(async () => {
    const catalogApi = apiHolder.get(catalogApiRef);
    if (catalogApi) {
      const retrievedEntity = await catalogApi.getEntityByRef(
        compoundEntityRef,
      );
      if (!retrievedEntity) {
        throw new Error(`${compoundEntityRef.name} was not found`);
      }
      return retrievedEntity;
    }
    return undefined;
  }, [apiHolder, compoundEntityRef]);

  const handleOnMouseLeave = () => {
    setIsHovered(false);
    debouncedHandleMouseEnter.cancel();
  };

  useEffect(() => {
    if (popupState.isOpen && !entity && !error && !loading) {
      load();
    }
  }, [popupState.isOpen, load, entity, error, loading]);

  return (
    <>
      <span onMouseEnter={debouncedHandleMouseEnter}>
        <span data-testid="trigger" {...bindHover(popupState)}>
          {children}
        </span>
      </span>
      {isHovered && (
        <HoverPopover
          PaperProps={{
            className: classes.popoverPaper,
          }}
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onMouseLeave={handleOnMouseLeave}
        >
          <>
            {error && <ResponseErrorPanel error={error} />}
            <Card>
              {loading && <Progress />}

              <CardContent>
                {entity && (
                  <>
                    <Typography color="textSecondary">
                      {compoundEntityRef.namespace}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {compoundEntityRef.name}
                    </Typography>
                    <Typography color="textSecondary">{entity.kind}</Typography>
                    <Typography
                      className={classes.descriptionTypography}
                      paragraph
                    >
                      {entity.metadata.description}
                    </Typography>
                    <Typography>{entity.spec?.type}</Typography>
                    <Box marginTop="0.5em">
                      {(entity.metadata.tags || [])
                        .slice(0, maxTagChips)
                        .map(tag => {
                          return <Chip key={tag} size="small" label={tag} />;
                        })}
                      {entity.metadata.tags?.length &&
                        entity.metadata.tags?.length > maxTagChips && (
                          <Tooltip title="Drill into the entity to see all of the tags.">
                            <Chip key="other-tags" size="small" label="..." />
                          </Tooltip>
                        )}
                    </Box>
                  </>
                )}
              </CardContent>
              {!error && (
                <CardActions>
                  {entity && (
                    <>
                      {isUserEntity(entity) && (
                        <UserCardActions entity={entity} />
                      )}
                      {isGroupEntity(entity) && (
                        <GroupCardActions entity={entity} />
                      )}
                      <EntityCardActions entity={entity} />
                    </>
                  )}
                </CardActions>
              )}
            </Card>
          </>
        </HoverPopover>
      )}
    </>
  );
};
