export enum PlotCoordinateAction {
  DELETE_LAST_COORDINATE,
  DELETE_PLOT,
  ADD_COORDINATE_CURRENT_LOCATION,
}

export interface PlotActionWrapper {
  action: PlotCoordinateAction;
  plotId: string;
}
