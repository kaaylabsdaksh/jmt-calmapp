import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Database, Package, FileText } from "lucide-react";

export const SavedDataDisplay = () => {
  const [workOrderData, setWorkOrderData] = useState<any>(null);
  const [addNewItemData, setAddNewItemData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = () => {
    // Load work order data
    const savedWorkOrder = localStorage.getItem('workOrderData');
    if (savedWorkOrder) {
      setWorkOrderData(JSON.parse(savedWorkOrder));
    }

    // Load add new item data
    const savedAddNewItem = localStorage.getItem('modernAddNewItemData');
    if (savedAddNewItem) {
      setAddNewItemData(JSON.parse(savedAddNewItem));
    }

    // Load active tab
    const savedActiveTab = localStorage.getItem('addNewWorkOrderActiveTab');
    setActiveTab(savedActiveTab);
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'Not set';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'string' && value.length === 0) return 'Empty';
    if (typeof value === 'object' && value instanceof Date) {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  const renderDataSection = (title: string, data: any, icon: React.ReactNode) => {
    if (!data) {
      return (
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data saved yet</p>
          </CardContent>
        </Card>
      );
    }

    const entries = Object.entries(data).filter(([key, value]) => {
      // Filter out empty values for cleaner display
      return value !== '' && value !== null && value !== undefined;
    });

    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {entries.length} fields
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {entries.length > 0 ? (
              entries.map(([key, value]) => (
                <div key={key} className="flex justify-between items-start gap-2 py-1 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium capitalize text-muted-foreground min-w-0 flex-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </span>
                  <span className="text-sm text-foreground text-right max-w-[60%] break-words">
                    {formatValue(value)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">All fields are empty</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Saved Data Preview</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="work-order" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="work-order">Work Order</TabsTrigger>
          <TabsTrigger value="add-item">Add New Item</TabsTrigger>
          <TabsTrigger value="navigation">Navigation State</TabsTrigger>
        </TabsList>

        <TabsContent value="work-order" className="space-y-4">
          {renderDataSection(
            "Work Order Data", 
            workOrderData, 
            <FileText className="h-4 w-4 text-blue-500" />
          )}
        </TabsContent>

        <TabsContent value="add-item" className="space-y-4">
          {renderDataSection(
            "Add New Item Data", 
            addNewItemData, 
            <Package className="h-4 w-4 text-green-500" />
          )}
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-orange-500" />
                Navigation State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Active Tab:</span>
                  <Badge variant={activeTab ? "default" : "secondary"}>
                    {activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ') : 'None'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};