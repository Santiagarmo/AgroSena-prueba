"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const notificationSchema = z.object({
  cropType: z.string().min(2, { message: "Crop type is required." }),
  activityType: z.enum(["irrigation", "fertilization", "maintenance"], {
    required_error: "Activity type is required.",
  }),
  lastActivityDate: z.date({ required_error: "Last activity date is required." }),
  frequencyDays: z.coerce.number().min(1, { message: "Frequency must be at least 1 day." }),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [reminder, setReminder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      cropType: "",
      activityType: "irrigation",
      frequencyDays: 7,
    },
  });

  const onSubmit = async (values: NotificationFormValues) => {
    setIsLoading(true);
    setReminder(null);
    setError(null);

    // const input: GenerateFarmReminderInput = {
    //   ...values,
    //   lastActivityDate: format(values.lastActivityDate, "yyyy-MM-dd"), // Format date as string for AI
    // };

//     try {
//       const result = await generateFarmReminder(input);
//       if (result && result.reminderMessage) {
//         setReminder(result.reminderMessage);
//         toast.success("Reminder Generated", {
//           description: "AI has successfully generated a farm reminder.",
//         });
//       } else {
//         throw new Error("AI did not return a reminder message.");
//       }
//     } catch (err) {
//       console.error("Error generating reminder:", err);
//       const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
//       setError(`Failed to generate reminder: ${errorMessage}`);
//       toast.error("Error Generating Reminder", {
//         description: errorMessage,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Smart Notifications</h1>
        <p className="text-muted-foreground">
          Generate proactive reminders for key farm activities using AI.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Farm Reminder</CardTitle>
            <CardDescription>Fill in the details below to get an AI-powered reminder.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Corn, Tomatoes, Wheat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="irrigation">Irrigation</SelectItem>
                          <SelectItem value="fertilization">Fertilization</SelectItem>
                          <SelectItem value="maintenance">Equipment Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastActivityDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Activity Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequencyDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency (in days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Reminder"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Generated Reminder</CardTitle>
            <CardDescription>Your AI-generated reminder will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            {isLoading && (
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Generating your reminder...</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="text-center text-destructive">
                <AlertTriangle className="mx-auto h-12 w-12" />
                <p className="mt-2 font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {reminder && !isLoading && !error && (
              <Textarea
                value={reminder}
                readOnly
                className="w-full h-48 text-base bg-muted/50"
                aria-label="Generated reminder message"
              />
            )}
            {!reminder && !isLoading && !error && (
              <p className="text-muted-foreground">No reminder generated yet. Fill the form and click Generate Reminder.</p>
            )}
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Note on SMS/Push Notifications (RF-05)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page demonstrates AI-powered reminder generation. For actual delivery via SMS or Push Notifications,
            integration with backend services (e.g., Twilio for SMS, Firebase Cloud Messaging for Push) is required.
            This functionality would typically involve saving these reminders and scheduling their delivery through such services,
            which is beyond the scope of this frontend-focused implementation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}}
