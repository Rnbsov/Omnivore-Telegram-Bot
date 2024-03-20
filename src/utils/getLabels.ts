import { getSourceLabel } from './getSourceLabel.ts';
import { getDefaultLabel } from './getDefaultLabel.ts';
import { Label } from '../types.ts';
import { type Filter } from 'https://deno.land/x/grammy@v1.21.1/mod.ts';
import { MyContext } from '../sessionsHandler.ts';

export function getLabels(ctx: Filter<MyContext, 'message:entities:url'>): Label[] {
  const source = ctx.msg?.forward_origin;

  // retrieving information from session
  const sessionIncludeSource = ctx.session.includeSource;
  const sessionDefaultLabel = ctx.session.defaultLabel;

  const labels = [];

  // add default label
  const defaultLabel = getDefaultLabel(sessionDefaultLabel);
  if (defaultLabel.name) {
    labels.push(defaultLabel);
  }

  // add source label if includeSource is true
  if (source && sessionIncludeSource) {
    const sourceLabel = getSourceLabel(source);

    if (sourceLabel) {
      labels.push(sourceLabel);
    }
  }

  return labels;
}
